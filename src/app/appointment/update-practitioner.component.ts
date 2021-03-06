import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../model/user';
import { AppointmentService } from '../service/appointment.service';
import { UserProfileService } from '../service/user-profile.service';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-update-practitioner',
  templateUrl: './update-practitioner.component.html',
  styleUrls: ['./update-practitioner.component.css']
})
export class UpdatePractitionerComponent implements OnInit {

  username: string = this.tokenService.getUserName();
  profileData: User;
  practitioners: Array<User> = [];
  errorMessage: string;
  preFilePath = 'https://s3.us-east-2.amazonaws.com/onlinehealthcaresystem/';

  constructor(private appointmentService: AppointmentService, private toastr: ToastrService,
                  private tokenService: TokenService, private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.getProfile();
    this.getPractitioners();
  }

  getProfile(){
    this.profileData = new User();

    this.userProfileService.getProfileDetails(this.username)
      .subscribe(
        data => {
          this.profileData = data;
        },
        err => {
          this.toastr.error('Nem létezik a felhasználó', 'Hiba!', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }

      );
  }

  getPractitioners() {
    this.appointmentService.getAllPractitionerExceptMe(this.username).subscribe(
      response => {
        response.forEach(p => {
          if(p.practitioner.specialization != null && p.practitioner.workingAddress != null){
            this.practitioners.push(p);
          }
        })
      },
      err => {
        this.toastr.error('Nem létezik a felhasználó', 'Hiba!', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    );
  }

  selectedPractitioner(practitionerId: number){
    this.appointmentService.updatePractitioner(this.username, practitionerId)
    .subscribe(data => {
      window.location.reload();
    }, err => {
      this.errorMessage = err.error.message;
      this.toastr.error(this.errorMessage, 'Hiba!', {
        timeOut: 3000,  positionClass: 'toast-top-center'
      });
    }
  );
  this.toastr.success('Kiválasztottál egy orvost!', 'OK', {
    timeOut: 3000,  positionClass: 'toast-top-center',
  });
  }

}
