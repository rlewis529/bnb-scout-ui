import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AirbnbComponent } from './app/dashboards/airbnb/airbnb.component';

bootstrapApplication(AirbnbComponent, {
  providers: [
    provideHttpClient()
  ]
})
  .catch((err) => console.error(err));
