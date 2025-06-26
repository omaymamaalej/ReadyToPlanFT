import { Component, OnInit } from '@angular/core';
import { AiResponseDialogComponent } from '../ai-response-dialog/ai-response-dialog.component';
import { ProductSalesComponent } from '../product-sales/product-sales.component';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Product_sales } from 'src/app/models/Product_sales';
import { ProductSalesService } from 'src/app/services/product-sales.service';
import { AiGenerationService } from 'src/app/services/ai-generation.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  companyId: string | undefined = localStorage.getItem('selectedCompanyId') ?? undefined;

  showForm = false;
  products: Product_sales[] = [];
  id!: string;
  aiResponsesMap: { [productId: string]: string } = {};

  constructor(private productService: ProductSalesService, 
    private router: Router, 
    private dialogService: NbDialogService, 
    private aiService: AiGenerationService) { }

  ngOnInit(): void {
    if (!this.companyId) {
      console.warn('Aucune entreprise sélectionnée.');
    } else {
      this.getAllProducts(); 
    }
  }



  openForm() {
    this.showForm = true;
  }
  openAddProductDialog() {
    this.dialogService
      .open(ProductSalesComponent, {
        context: {
          companyId: this.companyId,
        },
      })
      .onClose.subscribe(res => {
        if (res) {
          console.log('Produit ajouté', res);
          this.getAllProducts(); 
        }
      });
  }
  showAIResponseDialog(response: string) {
    this.dialogService.open(AiResponseDialogComponent, {
      context: {
        aiResponse: response
      },
    });
  }

  onFormSubmitted(newProducts: Product_sales[]) {
    this.products.push(...newProducts); 
    this.showForm = false;            
  }
  getAllProducts() {
    this.productService.getByCompanyId(this.companyId!).subscribe(products => {
      this.products = products;

      this.products.forEach(product => {
        if (product.id) {
          this.aiService.getAIResponse('PRODUCT', product.id!)
            .subscribe({
              next: res => {
                this.aiResponsesMap[product.id!] = res.aiResponse;
              },
              error: err => {
                this.aiResponsesMap[product.id!] = 'Aucune réponse IA disponible.';
                console.error(`Erreur IA pour ${product.id}`, err);
              },
            });
        }
      });
    });
  }


  editProduct(product: Product_sales): void {
    this.dialogService
      .open(ProductSalesComponent, {
        context: { productToEdit: product },
      })
      .onClose.subscribe((updatedProduct: Product_sales) => {
        if (updatedProduct) {
          this.getAllProducts(); 
        }
      });
  }

  deleteProduct(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.delete(id).subscribe(() => {
        this.getAllProducts(); 
      });
    }
  }


  addNewProduct(): void {
    this.router.navigate(['/add-product']);
  }

}