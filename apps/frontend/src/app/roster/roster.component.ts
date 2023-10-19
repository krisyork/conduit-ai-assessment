import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ArticleService } from '../article.service';

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
  styleUrls: ['./roster.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  // Add this line for OnPush change detection strategy
})
export class RosterComponent implements OnInit {
  authorsStats: AuthorStats[] = [];

  constructor(private articleService: ArticleService, private cdr: ChangeDetectorRef) {}  // Inject ChangeDetectorRef

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
      this.cdr.markForCheck();  // Add this line to manually trigger change detection
      console.log(this.authorsStats);
    });
  }
}

