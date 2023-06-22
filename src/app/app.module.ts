import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { IngresarComponent } from './pages/ingresar/ingresar.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { ReactiveFormsModule } from '@angular/forms';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroEspecialistaComponent } from './components/registro-especialista/registro-especialista.component';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';
import { FormsModule } from '@angular/forms';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AdmUsuariosComponent } from './pages/adm-usuarios/adm-usuarios.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    IngresarComponent,
    RegistroComponent,
    RegistroEspecialistaComponent,
    EspecialidadesComponent,
    UsuariosComponent,
    AdmUsuariosComponent,
    MisTurnosComponent,
    MiPerfilComponent,
    SolicitarTurnoComponent,

  ],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
