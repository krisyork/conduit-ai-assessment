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
    id: number;  // Change this to id
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
    // Fetch usernames first
    this.articleService.getUsernames().subscribe(usernames => {
      this.articleService.getAllArticles().subscribe(data => {
        const articles: Article[] = data.articles;
        const stats: Record<number, AuthorStats> = {};  // Change key to number for author ID

        articles.forEach(article => {
          const authorId = article.author.id;
          if (!stats[authorId]) {
            stats[authorId] = {
              username: usernames[authorId],  // Fetch username from the usernames list
              totalArticles: 0,
              totalFavorites: 0,
              firstArticleDate: new Date(article.createdAt)
            };
          }
          stats[authorId].totalArticles++;
          stats[authorId].totalFavorites += article.favoritesCount;
          const articleDate = new Date(article.createdAt);
          if (articleDate < stats[authorId].firstArticleDate) {
            stats[authorId].firstArticleDate = articleDate;
          }
        });

        this.authorsStats = Object.values(stats).sort((a: AuthorStats, b: AuthorStats) => b.totalFavorites - a.totalFavorites);
        this.cdr.markForCheck();
        console.log(this.authorsStats);
      });
    });
  }
}