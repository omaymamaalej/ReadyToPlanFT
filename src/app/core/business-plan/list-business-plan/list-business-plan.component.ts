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

@Component({
  selector: 'app-list-business-plan',
  templateUrl: './list-business-plan.component.html',
  styleUrls: ['./list-business-plan.component.css']
})
export class ListBusinessPlanComponent implements OnInit {
  businessPlans: BusinessPlan[] = [];
  businessPlanDto: BusinessPlanDto[] = [];

  // @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  @ViewChild('deleteDialog', { static: true }) deleteDialog!: TemplateRef<any>;



  idTodelete: string = '';

  selectedPresentation?: string;
  selectedBusinessPlanName?: string;
  selectedBusinessPlan?: BusinessPlanDto;

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


  generatePresentation(businessPlan: BusinessPlanDto): void {
    this.businessPlansService.generateBusinessPlan(businessPlan).subscribe({
      next: (presentation: string) => {
        this.dialogService.open(PresentationDialogComponent, {
          context: {
            businessPlanName: businessPlan.companyName,
            presentationContent: presentation,
          },
          closeOnBackdropClick: true,
          closeOnEsc: true,
        });
      },
      error: () => {
        alert("Erreur lors de la génération de la présentation.");
      }
    });
  }

  closePresentation(): void {
    this.selectedPresentation = undefined;
    this.selectedBusinessPlanName = undefined;
  }

  openWithoutBackdrop(businessPlan: any) {
    const dialogRef = this.dialogService.open(UpdateBusinessPlanComponent, {
      context: {
        businessPlan: businessPlan
      },
      hasBackdrop: false 
    });

    dialogRef.onClose.subscribe((result) => {
      if (result === true) {
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
    console.log('Suppression de :', this.idTodelete);
    this.businessPlansService.delete(this.idTodelete).subscribe({
      next: () => {
        this.businessPlans = this.businessPlans.filter(bp => bp.id !== this.idTodelete);
        this.businessPlanDto = this.inintbusinessPlanDto(this.businessPlans);
      },
      error: () => {
        alert('Erreur lors de la suppression.');
      }
    });
  }


  currentPage = 1;
  totalPages = 1;
  page: number = 1;
}
