import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Submission } from '../../models/submission.model';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit {

  allSubmissions: Submission[] = [];
  filteredSubmissions: Submission[] = [];
  paginatedSubmissions: Submission[] = [];

  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  isLoading = true;
  hasError = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  // 🚀 Load with smooth UX delay
  loadSubmissions(): void {
    this.isLoading = true;
    this.hasError = false;

    this.apiService.getSubmissions().subscribe({
      next: (data) => {

        // small delay = smoother UX (feels intentional)
        setTimeout(() => {
          this.allSubmissions = data || [];
          this.applyFilter();
          this.isLoading = false;
        }, 700);

      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // 🔍 Search
  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase().trim();

    this.filteredSubmissions = q
      ? this.allSubmissions.filter(s =>
          (s.full_name || '').toLowerCase().includes(q)
        )
      : [...this.allSubmissions];

    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredSubmissions.length / this.pageSize)
    );

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.updatePage();
  }

  // 📄 Pagination logic
  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedSubmissions = this.filteredSubmissions.slice(
      start,
      start + this.pageSize
    );

    // 👇 scroll to top smoothly when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  // 🕒 Format date
  formatDate(dateStr: string): string {
    if (!dateStr) return '';

    const d = new Date(dateStr);

    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' ' +
    d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 🔢 Page numbers
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}