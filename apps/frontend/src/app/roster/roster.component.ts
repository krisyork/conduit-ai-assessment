import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { ChangeDetectorRef } from '@angular/core';

// Define the types
interface AuthorStats {
  username: string;
  totalArticles: number;
  totalFavorites: number;
  firstArticleDate: Date;
}

interface Article {
  author: {
    username: string;
  };
  createdAt: string;
  favoritesCount: number;
}

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit {
  authorsStats: AuthorStats[] = [];

  constructor(private articleService: ArticleService, ) {}

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe(data => {
      const articles: Article[] = data.articles;
      const stats: Record<string, AuthorStats> = {};

      articles.forEach(article => {
        const author = article.author.username;
        if (!stats[author]) {
          stats[author] = {
            username: author,
            totalArticles: 0,
            totalFavorites: 0,
            firstArticleDate: new Date(article.createdAt)
          };
        }
        stats[author].totalArticles++;
        stats[author].totalFavorites += article.favoritesCount;
        const articleDate = new Date(article.createdAt);
        if (articleDate < stats[author].firstArticleDate) {
          stats[author].firstArticleDate = articleDate;
        }
      });

      this.authorsStats = Object.values(stats).sort((a: AuthorStats, b: AuthorStats) => b.totalFavorites - a.totalFavorites);
    });
  }
}
