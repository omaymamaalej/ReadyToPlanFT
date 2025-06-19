import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product_sales } from 'src/app/models/Product_sales';
import { ProductSalesService } from 'src/app/services/product-sales.service';
import { ProductSalesComponent } from '../product-sales/product-sales.component';
import { NbDialogService } from '@nebular/theme';
import { AiGenerationServiceService } from 'src/app/services/ai-generation-service.service';
import { AiResponseDialogComponent } from '../ai-response-dialog/ai-response-dialog.component';


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
 
  constructor(private productService: ProductSalesService, private router: Router, private dialogService: NbDialogService,private aiService: AiGenerationServiceService) {}

  ngOnInit(): void {
     if (!this.companyId) {
    console.warn('Aucune entreprise sélectionnée.');
    // Tu peux aussi rediriger vers la page entreprise ici
  } else {
    this.getAllProducts(); // ↦ Appelé uniquement si une company est sélectionnée
  }}

 

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
        this.getAllProducts(); // actualiser la liste
      }
    });}
    showAIResponseDialog(response: string) {
  this.dialogService.open(AiResponseDialogComponent, {
    context: {
      aiResponse: response
    },
  });
}

onFormSubmitted(newProducts: Product_sales[]) {
  this.products.push(...newProducts); // ajouter les nouveaux produits à la liste
  this.showForm = false;              // revenir à la liste après création
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
        this.getAllProducts();  // ← recharge la liste après modif
      }
    });}

 deleteProduct(id: string): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    this.productService.delete(id).subscribe(() => {
      this.getAllProducts(); // Recharge les produits après suppression
    });
  }
}
  

  addNewProduct(): void {
    this.router.navigate(['/add-product']);
  }

}
