import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  loading: boolean = false
  users: User[] = [];

  showSearchBar = false;
  searchTerm = '';

   public readonly paginationConfig: PaginationInstance = {
      id: 'allUserPagination', 
      itemsPerPage: 6,
      currentPage: 1,
      totalItems: 0
    };

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.get();
    this.paginationConfig.totalItems = this.users.length;
  }

  get() {
    this.loading = true;

    this.userService.get().subscribe((data) => {

      this.users = data.map(user => ({
        ...user,
        createdDate: user.createdDate ? new Date(user.createdDate) : undefined
      }));


      console.log("--------users---------", this.users)
      this.loading = false;

    });
  }
  
  setActive(user: User, isActivated: boolean): void {
    this.userService.update({ ...user, activated: isActivated }).subscribe((updatedUser) => {
      const index = this.users.findIndex((u) => u.id === updatedUser.id);
      this.users[index] = updatedUser;
    });
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    if (!this.showSearchBar) {
      this.searchTerm = '';
      this.onSearch(); // Pour réinitialiser la liste si nécessaire
    }
  }

  onSearch() {
    // Implémentez votre logique de recherche ici
    // Par exemple, filtrer businessPlanDto en fonction de searchTerm
  }


  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
  }


}