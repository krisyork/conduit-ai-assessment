import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ArticleService } from '../article.service';
import { forkJoin } from 'rxjs';

// Define the types
interface AuthorStats {
  username: string;
  totalArticles: number;
  totalFavorites: number;
  firstArticleDate: Date;
}

interface Article {
  author: {
    id: number;
  };
  createdAt: string;
  favoritesCount: number;
}

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RosterComponent implements OnInit {
  authorsStats: AuthorStats[] = [];

  constructor(private articleService: ArticleService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    forkJoin({
      articlesData: this.articleService.getAllArticles(),
      usernames: this.articleService.getUsernames()
    }).subscribe(({ articlesData, usernames }) => {
      console.log(articlesData);  // Log the articlesData to see its structure

      const articles = articlesData.articles;  // Assuming the structure is { articles: [...], count: ... }

      const stats: Record<string, AuthorStats> = {};

      if (Array.isArray(articles)) {  // Check if articles is an array
        (articles as Article[]).forEach(article => {
          const username = usernames[article.author.id - 1];
          if (!stats[username]) {
            stats[username] = {
              username: username,
              totalArticles: 0,
              totalFavorites: 0,
              firstArticleDate: new Date(article.createdAt)
            };
          }
          stats[username].totalArticles++;
          stats[username].totalFavorites += article.favoritesCount;
          const articleDate = new Date(article.createdAt);
          if (articleDate < stats[username].firstArticleDate) {
            stats[username].firstArticleDate = articleDate;
          }
        });
      } else {
        console.error("Expected articles to be an array, but got:", articles);
      }

      this.authorsStats = Object.values(stats).sort((a: AuthorStats, b: AuthorStats) => b.totalFavorites - a.totalFavorites);
      this.cdr.markForCheck();
      console.log(this.authorsStats);
    });
  }
}
