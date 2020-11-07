import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isAdmin: boolean = false;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isAdmin().subscribe(flag => this.isAdmin = flag);
  }
}
