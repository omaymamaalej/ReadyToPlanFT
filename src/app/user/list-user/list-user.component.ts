import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = [];
  loading: boolean = false;

  searchTerm: string = '';
  selectedStatus: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private userService: UserService,
    private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.get().subscribe((data) => {
      this.users = data.map(user => ({
        ...user,
        createdDate: user.createdDate ? new Date(user.createdDate) : undefined
      }));
      this.applyFilters();
      this.loading = false;
    });
  }

  toggleStatus(user: User) {
    this.userService.update({ ...user, activated: !user.activated }).subscribe(updated => {
      const idx = this.users.findIndex(u => u.id === updated.id);
      this.users[idx] = updated;
      this.applyFilters();
    });
  }

  editUser(user: User) {
    // logiques pour éditer l'utilisateur
  }

  deleteUser(user: User) {
    if (user.login === 'admin' || !user.id) return;

    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete User',
        message: `Are you sure you want to delete user "${user.login}"? This action cannot be undone.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        icon: 'trash-2-outline',
        status: 'danger'
      }
    }).onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.delete(user.id!).subscribe({
          next: () => this.loadUsers(),   
          error: (err) => console.error(err)
        });
      }
    });
  }




  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.login?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus==='activated' && user.activated) || 
        (this.selectedStatus==='deactivated' && !user.activated);
      return matchesSearch && matchesStatus;
    });
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  updatePagedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedUsers = this.filteredUsers.slice(start, end);
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if(page<1 || page>this.totalPages) return;
    this.currentPage = page;
    this.updatePagedUsers();
  }

  nextPage() { this.goToPage(this.currentPage+1); }
  prevPage() { this.goToPage(this.currentPage-1); }
}
