import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../model/user';
import { PatientService } from '../service/patient.service';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {

  username: string;
  updateProfile: User;
  errorMessage: string;

  name: string;
  email: string;
  address: string;
  dateOfBorn: Date;

  minDate = new Date(1900,1,1);
  maxDate = new Date();

  constructor(private tokenService: TokenService, private patientService: PatientService,
              private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.updateProfile = new User();
    this.username = this.tokenService.getUserName();

    this.patientService.getProfileDetails(this.username)
    .subscribe(data => {
      this.updateProfile = data;
      this.name = this.updateProfile.patient.name;
      this.email = this.updateProfile.patient.email;
      this.address = this.updateProfile.patient.address;
      this.dateOfBorn = this.updateProfile.patient.dateOfBorn;
    }, error => console.log(error));

  }

  editProfile() {
    this.updateProfile.patient.name = this.name;
    this.updateProfile.patient.email = this.email;
    this.updateProfile.patient.address = this.address;
    this.updateProfile.patient.dateOfBorn = this.dateOfBorn;

    this.patientService.updateProfile(this.username, this.updateProfile)
      .subscribe(data => {
        this.gotoList();
      }, err => {
        this.errorMessage = err.error.message;
        this.toastr.error(this.errorMessage, 'Hiba!', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        console.log(err)
      }
    );
  }

  gotoList() {
    this.router.navigate(['/profile']);
  }

  onSubmit() {
    this.editProfile();
  }


}