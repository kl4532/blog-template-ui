import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isAdmin: boolean;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    // TO FIX
    // this should be placed in auth service, and call here only to set flag
    this.authService.getAdmins().subscribe(admins => {
      const res = admins.find( admin => admin['email'] === this.authService.currentUserEmail);
       res === undefined ? this.isAdmin = false : this.isAdmin = true;
    });

    // this.isAdmin = this.authService.isAdmin();
  }

}
