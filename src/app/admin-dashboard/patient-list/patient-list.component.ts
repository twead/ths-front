import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'src/app/modal/modal.component';
import { User } from 'src/app/model/user';
import { AdminDashboardService } from 'src/app/service/admin-dashboard.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  patients: Array<User> = [];
  errorMessage: string;
  name: any;
  totalRecords: number;
  page:number = 1;
  preFilePath = 'https://s3.us-east-2.amazonaws.com/onlinehealthcaresystem/';

  constructor(private adminService: AdminDashboardService, private router: Router,
              private toastr: ToastrService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.getPatients();
  }

  deletePatient(id: number, username: string) {

    const dialogRef = this.matDialog.open(ModalComponent, {
      width: '300px',
      data:{
        title: "Biztosan törlöd őt?",
        paragraph: username
    }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.adminService.deletePatient(id)
          .subscribe(
            data => {
              this.toastr.success('Páciens törölve!', 'OK', {
                timeOut: 3000,  positionClass: 'toast-top-center',
              });
              this.getPatients();
            },
            err => {
              this.errorMessage = err.error.message;
              this.toastr.error(this.errorMessage, 'Hiba!', {
                timeOut: 3000,  positionClass: 'toast-top-center',
              });
            }
          );
      }
    });
  }

  getPatients() {
    this.adminService.getAllPatient().subscribe(
      response => {
        this.patients = response;
      },
      error => {
        // TODO: Error message
      }
    );
  }

  getPatientDetails(id: number){
    this.router.navigate(['patients/details', id]);
  }

  updatePatient(id: number){
    this.router.navigate(['patients/update', id]);
  }

  updateToPractitioner(id: number, username: string){

    const dialogRef = this.matDialog.open(ModalComponent, {
      width: '300px',
      data:{
        title: "Biztosan szeretnéd, hogy ő orvos legyen?",
        paragraph: username
    }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true){

        this.adminService.upgradeToPractitioner(id).subscribe(
          response => {
            this.toastr.success("Orvos rang kiosztva", 'OK', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
          },
          error => {
            this.toastr.error(error.error.message, 'Hiba', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
          }
        );
      }
    });
  }

  search(){
    if(this.name == ""){
      this.ngOnInit();
    } else{
      this.patients = this.patients.filter(res=>{
        return res.patient.name.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
      })
    }
  }
}
