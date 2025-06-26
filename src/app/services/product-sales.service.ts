import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product_sales } from '../models/Product_sales';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductSalesService {

  private baseUrl = 'http://localhost:8080/api/product-or-services';

  constructor(private http: HttpClient) { }
  
  create(payload: Product_sales) {
    
    if (!payload.companyId) {
      throw new Error('companyId est requis pour créer un produit');
    }

    const url = `http://localhost:8080/api/product-or-services?companyId=${payload.companyId}`;
    return this.http.post<Product_sales>(url, payload);
  }



  getAll(): Observable<Product_sales[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getByCompanyId(companyId: string) {
    return this.http.get<Product_sales[]>(`http://localhost:8080/api/product-or-services/by-company/${companyId}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: string, product: Product_sales): Observable<Product_sales> {
    return this.http.put<Product_sales>(`${this.baseUrl}/${id}`, product);
  }

}
