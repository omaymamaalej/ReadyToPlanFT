import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NB_DIALOG_CONFIG, NbDialogRef } from '@nebular/theme';
import { forkJoin } from 'rxjs';
import { Product_sales } from 'src/app/models/Product_sales';
import { ProductSalesService } from 'src/app/services/product-sales.service';

@Component({
  selector: 'app-product-sales',
  templateUrl: './product-sales.component.html',
  styleUrls: ['./product-sales.component.css']
})
export class ProductSalesComponent implements OnInit {
  
  @Output() formSubmitted = new EventEmitter<Product_sales[]>();
  @Input() productToEdit?: Product_sales;
  @Input() companyId?: string;
  isEditMode = false;
  productForm!: FormGroup;
  calculatedRevenues: number[] = [];
  totalRevenue = 0;

  constructor(private fb: FormBuilder,
    private product_salesService: ProductSalesService,
    private router: Router,
    protected dialogRef: NbDialogRef<ProductSalesComponent>
    ,
    @Inject(NB_DIALOG_CONFIG) private config: any) {
    this.companyId = config?.context?.companyId ?? null;
  }

  ngOnInit(): void {
    console.log('ID de l\'entreprise reçue :', this.companyId);
    this.productForm = this.fb.group({
      items: this.fb.array([]),
    });

    if (this.productToEdit) {
      this.isEditMode = true;
      this.loadProductForEdit(this.productToEdit);
    } else {
      this.addItem();
    }

  }
  loadProductForEdit(product: Product_sales): void {
    const group = this.fb.group({
      id: [product.id], 
      nameProductOrService: [product.nameProductOrService, Validators.required],
      productDescription: [product.productDescription],
      unitPrice: [product.unitPrice, [Validators.required, Validators.min(0)]],
      estimatedMonthlySales: [product.estimatedMonthlySales, [Validators.required, Validators.min(0)]],
      durationInMonths: [product.durationInMonths, [Validators.required, Validators.min(0)]],
    });

    this.items.push(group);

    const revenue =
      (product.unitPrice ?? 0) *
      (product.estimatedMonthlySales ?? 0) *
      (product.durationInMonths ?? 0);
    this.calculatedRevenues.push(revenue);
    this.calculateTotalRevenue();
  }
  get items(): FormArray {
    return this.productForm.get('items') as FormArray;
  }

  addItem(product?: Product_sales): void {
    const group = this.fb.group({
      id: [product?.id],
      nameProductOrService: [product?.nameProductOrService || '', Validators.required],
      productDescription: [product?.productDescription || ''],
      unitPrice: [product?.unitPrice || 0, [Validators.required, Validators.min(0)]],
      estimatedMonthlySales: [product?.estimatedMonthlySales || 0, [Validators.required, Validators.min(0)]],
      durationInMonths: [product?.durationInMonths || 0, [Validators.required, Validators.min(0)]],
    });

    this.items.push(group);
    const revenue = (group.value.unitPrice || 0) * (group.value.estimatedMonthlySales || 0) * (group.value.durationInMonths || 0);
    this.calculatedRevenues.push(revenue);
    this.calculateTotalRevenue();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculatedRevenues.splice(index, 1);
    this.calculateTotalRevenue();
  }

  updateRevenue(index: number): void {
    const item = this.items.at(index).value;
    const revenue = (item.unitPrice || 0) * (item.estimatedMonthlySales || 0) * (item.durationInMonths || 0);
    this.calculatedRevenues[index] = revenue;
    this.calculateTotalRevenue();
  }

  calculateTotalRevenue(): void {
    this.totalRevenue = this.calculatedRevenues.reduce((sum, val) => sum + val, 0);
  }

  submit(): void {
    if (this.productForm.valid) {
      const items = this.productForm.value.items as Product_sales[];
      const requests = items.map(product => {
        product.companyId = this.companyId;
        return this.product_salesService.create(product);
      });

      forkJoin(requests).subscribe({
        next: (results) => {
          console.log('Tous les produits enregistrés', results);
          this.dialogRef?.close(true);
          this.router.navigate(['/product-detail', results[0].id]); 
        },
        error: (err) => console.error('Erreur lors de la création de produits :', err),
      });

      this.formSubmitted.emit(items);
    } else {
      console.warn('Formulaire invalide');
    }
  }


}