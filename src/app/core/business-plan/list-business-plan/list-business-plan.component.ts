import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import * as dayjs from 'dayjs';
import { Country } from 'src/app/enumerations/country.enum';
import { Currency } from 'src/app/enumerations/currency.enum';
import { Languages } from 'src/app/enumerations/languages.enum';
import { BusinessPlan, BusinessPlanDto } from 'src/app/models/BusinessPlan';
import { PresentationDialogComponent } from 'src/app/core/business-plan/presentation-dialog/presentation-dialog.component';
import { BusinessPlanService } from 'src/app/services/business-plan.service';
import { UpdateBusinessPlanComponent } from '../update-business-plan/update-business-plan.component';
import { Slide } from 'src/app/models/Slide';
import { DownloadHelper } from 'src/app/_helpers/download.helper';

@Component({
  selector: 'app-list-business-plan',
  templateUrl: './list-business-plan.component.html',
  styleUrls: ['./list-business-plan.component.css']
})
export class ListBusinessPlanComponent implements OnInit {
  businessPlans: BusinessPlan[] = [];
  businessPlanDto: BusinessPlanDto[] = [];

  @ViewChild('deleteDialog', { static: true }) deleteDialog!: TemplateRef<any>;
  @ViewChild('presentationOptionsDialog', { static: true }) presentationOptionsDialog!: TemplateRef<any>;

  @ViewChild('downloadOptionsDialog', { static: true }) downloadOptionsDialog!: TemplateRef<any>;
  currentBusinessPlanForDownload?: BusinessPlanDto;

  isDialogOpen = false;
  idTodelete: string = '';
  selectedPresentation?: string;
  selectedBusinessPlanName?: string;
  selectedBusinessPlan?: BusinessPlanDto;
  currentBusinessPlanForPresentation?: BusinessPlanDto;

  constructor(
    private businessPlansService: BusinessPlanService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {
    this.loadBusinessPlans();
  }

  loadBusinessPlans(): void {
    this.businessPlansService.get().subscribe((data: BusinessPlanDto[]) => {
      this.businessPlans = data;
      this.businessPlanDto = this.inintbusinessPlanDto(this.businessPlans);
    });
  }

  inintbusinessPlanDto(businessPlans: BusinessPlan[]): BusinessPlanDto[] {
    let tempBusinessPlanDto: BusinessPlanDto[] = [];

    businessPlans.forEach((businessPlan) => {
      const restDto: BusinessPlanDto = {
        id: businessPlan.id,
        companyName: businessPlan.companyName,
        companyStartDate: businessPlan.companyStartDate || dayjs(),
        country: businessPlan.country || Country.FRANCE,
        languages: businessPlan.languages || Languages.ENGLISH,
        companyDescription: businessPlan.companyDescription,
        anticipatedProjectSize: businessPlan.anticipatedProjectSize,
        currency: businessPlan.currency || Currency.EUR,
      };
      tempBusinessPlanDto.push(restDto);
    });

    return tempBusinessPlanDto;
  }

  openPresentationOptions(businessPlan: BusinessPlanDto): void {
    this.currentBusinessPlanForPresentation = businessPlan;
    this.dialogService.open(this.presentationOptionsDialog);
  }

  handlePresentationChoice(choice: 'generated' | 'edited' | 'regenerate'): void {
    if (!this.currentBusinessPlanForPresentation) return;

    switch (choice) {
      case 'generated':
        this.getExistingPresentation(false);
        break;
      case 'edited':
        this.getExistingPresentation(true);
        break;
      case 'regenerate':
        this.regeneratePresentation();
        break;
    }
  }

  private getExistingPresentation(preferEdited: boolean): void {
    if (!this.currentBusinessPlanForPresentation) return;

    this.businessPlansService.getPresentation(this.currentBusinessPlanForPresentation.companyName).subscribe({
      next: (slides: Slide[]) => {
        const presentation = this.convertSlidesToPresentation(slides);
        this.displayPresentation(
          this.currentBusinessPlanForPresentation!.id,
          this.currentBusinessPlanForPresentation!.companyName,
          presentation
        );
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de la présentation :", err);
        this.generateAndDisplayNewPresentation(this.currentBusinessPlanForPresentation!);
      }
    });
  }

  private convertSlidesToPresentation(slides: Slide[]): string {
    return slides.map(slide => slide.content).join("\n===SLIDE===\n");
  }

  private regeneratePresentation(): void {
    if (!this.currentBusinessPlanForPresentation) return;

    const businessPlanToSend: BusinessPlan = {
      id: this.currentBusinessPlanForPresentation.id,
      companyName: this.currentBusinessPlanForPresentation.companyName,
      companyStartDate: this.currentBusinessPlanForPresentation.companyStartDate,
      country: this.currentBusinessPlanForPresentation.country,
      languages: this.currentBusinessPlanForPresentation.languages,
      companyDescription: this.currentBusinessPlanForPresentation.companyDescription,
      anticipatedProjectSize: this.currentBusinessPlanForPresentation.anticipatedProjectSize,
      currency: this.currentBusinessPlanForPresentation.currency
    };

    this.businessPlansService.generateBusinessPlan(businessPlanToSend).subscribe({
      next: (presentation: string) => {
        this.displayPresentation(
          this.currentBusinessPlanForPresentation!.id,
          this.currentBusinessPlanForPresentation!.companyName,
          presentation
        );
      },
      error: (err) => {
        console.error("Erreur lors de la régénération de la présentation :", err);
        alert("Erreur lors de la régénération de la présentation.");
      }
    });
  }

  private generateAndDisplayNewPresentation(businessPlan: BusinessPlanDto): void {
    const businessPlanToSend: BusinessPlan = {
      id: businessPlan.id,
      companyName: businessPlan.companyName,
      companyStartDate: businessPlan.companyStartDate,
      country: businessPlan.country,
      languages: businessPlan.languages,
      companyDescription: businessPlan.companyDescription,
      anticipatedProjectSize: businessPlan.anticipatedProjectSize,
      currency: businessPlan.currency
    };

    this.businessPlansService.generateBusinessPlan(businessPlanToSend).subscribe({
      next: (presentation: string) => {
        this.displayPresentation(businessPlan.id, businessPlan.companyName, presentation);
      },
      error: (err) => {
        console.error("Erreur lors de la génération de la présentation :", err);
        alert("Erreur lors de la génération de la présentation.");
      }
    });
  }

  private displayPresentation(id: string, companyName: string, presentation: string): void {
    this.dialogService.open(PresentationDialogComponent, {
      context: {
        businessPlanId: id,
        businessPlanName: companyName,
        presentationContent: presentation,
      },
      closeOnBackdropClick: true,
      closeOnEsc: true,
    });
  }

  closePresentation(): void {
    this.selectedPresentation = undefined;
    this.selectedBusinessPlanName = undefined;
  }

  openWithoutBackdrop(businessPlan: any) {
    this.isDialogOpen = true;
    const dialogRef = this.dialogService.open(UpdateBusinessPlanComponent, {
      context: {
        businessPlan: businessPlan
      },
      hasBackdrop: false
    });

    dialogRef.onClose.subscribe((result) => {
      if (result === true) {
        this.isDialogOpen = false;
        this.loadBusinessPlans();
      }
    });
  }

  openDeleteDialog(id: string) {
    this.idTodelete = id;
    const dialogRef = this.dialogService.open(this.deleteDialog, {
      context: { id }
    });

    dialogRef.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.delete();
      }
    });
  }

  delete() {
    this.businessPlansService.delete(this.idTodelete).subscribe({
      next: () => {
        this.businessPlans = this.businessPlans.filter(bp => bp.id !== this.idTodelete);
        this.businessPlanDto = this.inintbusinessPlanDto(this.businessPlans);
      },
      error: (err) => {
        console.error("Erreur lors de la suppression :", err);
        alert('Erreur lors de la suppression.');
      }
    });
  }

  openDownloadOptions(businessPlan: BusinessPlanDto): void {
    this.currentBusinessPlanForDownload = businessPlan;
    this.dialogService.open(this.downloadOptionsDialog);
  }

  handleDownloadChoice(format: 'pdf' | 'powerpoint'): void {
    if (!this.currentBusinessPlanForDownload) return;

    if (format === 'pdf') {
      this.downloadAsPdf();
    } else {
      this.downloadAsPowerPoint();
    }
  }

  private downloadAsPdf(): void {
    if (!this.currentBusinessPlanForDownload) return;

    this.businessPlansService.downloadPresentation(
      this.currentBusinessPlanForDownload.companyName,
      'PDF'
    ).subscribe(blob => {
      const filename = `business-plan-${this.currentBusinessPlanForDownload?.companyName}-${new Date().toISOString().slice(0, 10)}.pdf`;
      DownloadHelper.downloadFile(blob, filename);
    });
  }

  private downloadAsPowerPoint(): void {
    if (!this.currentBusinessPlanForDownload) return;

    this.businessPlansService.downloadPresentation(
      this.currentBusinessPlanForDownload.companyName,
      'PPTX'
    ).subscribe(blob => {
      const filename = `business-plan-${this.currentBusinessPlanForDownload?.companyName}-${new Date().toISOString().slice(0, 10)}.pptx`;
      DownloadHelper.downloadFile(blob, filename);
    });
  }

  currentPage = 1;
  totalPages = 1;
  page: number = 1;
}

