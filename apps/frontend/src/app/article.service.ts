import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = '/api/articles';

  constructor(private http: HttpClient) {}

  getAllArticles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
