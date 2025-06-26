import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Currency } from 'src/app/enumerations/currency.enum';
import { Marketing } from 'src/app/models/Marketing';
import { MarketingService } from 'src/app/services/marketing.service';

@Component({
  selector: 'app-marketing-detail',
  templateUrl: './marketing-detail.component.html',
  styleUrls: ['./marketing-detail.component.css']
})
export class MarketingDetailComponent implements OnInit {
  
  @Input() marketingToEdit?: Marketing;
  companyId: string | undefined = localStorage.getItem('selectedCompanyId') ?? undefined;

  form!: FormGroup;

  currencies = Object.values(Currency);
  distribution_ChannelList = ['Retail', 'Online', 'Wholesale'];
  marketing_channelList = ['Email', 'Social Media', 'TV', 'Radio'];

  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService,
    protected dialogRef: NbDialogRef<MarketingDetailComponent>,

  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.marketingToEdit?.id],
      distribution_Channel: [this.marketingToEdit?.distribution_Channel || this.distribution_ChannelList[0], Validators.required],
      marketing_channel: [this.marketingToEdit?.marketing_channel || this.marketing_channelList[0], Validators.required],
      sales_target: [this.marketingToEdit?.sales_target, [Validators.required, Validators.min(0)]],
      currency: [this.marketingToEdit?.currency || Currency.USD, Validators.required],

    });
  }


  submit(): void {
    const marketing = this.form.value;
    const companyId = localStorage.getItem('selectedCompanyId');

    if (!companyId) {
      alert('Aucune entreprise sélectionnée');
      return;
    }

    if (marketing.id) {
      // 🔁 Pour update, pas besoin de companyId
      this.marketingService.update(marketing.id, marketing).subscribe(() => this.dialogRef.close(true));
    } else {
      // ✅ Créer avec companyId en tant que paramètre URL
      this.marketingService.create(marketing, companyId).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

}