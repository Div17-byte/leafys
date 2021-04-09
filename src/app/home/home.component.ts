import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare function myHome():any ;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private router:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("token")){
      this.router.navigate(['/'])

    }
        myHome();
}

scroll(el: HTMLElement){
el.scrollIntoView({behavior: 'smooth'})
}



}
