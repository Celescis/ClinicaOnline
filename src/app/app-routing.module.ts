import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IngresarComponent } from './pages/ingresar/ingresar.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroEspecialistaComponent } from './components/registro-especialista/registro-especialista.component';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';
import { AdmUsuariosComponent } from './pages/adm-usuarios/adm-usuarios.component';
import { CanActivateAdministradorGuard } from './guards/can-activate-administrador.guard';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { AdmPacientesComponent } from './pages/adm-pacientes/adm-pacientes.component';
import { InformesComponent } from './pages/informes/informes.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdmUsuariosComponent,
    children: [{ path: 'adm-usuarios', component: AdmUsuariosComponent , canActivate: [CanActivateAdministradorGuard]}],
  },
  {
    path: 'admin',
    component: TurnosComponent,
    children: [{ path: 'turnos', component: TurnosComponent  , canActivate: [CanActivateAdministradorGuard]}],
  },
  {
    path: 'admin',
    component: InformesComponent,
    children: [{ path: 'informes', component: InformesComponent  , canActivate: [CanActivateAdministradorGuard]}],
  },
  { path: 'solicitar-turno', component: SolicitarTurnoComponent},
  { path: 'miPerfil', component: MiPerfilComponent},
  { path: 'misTurnos', component: MisTurnosComponent},
  { path: 'adm-pacientes', component: AdmPacientesComponent},
  { path: 'especialidades', component: EspecialidadesComponent },
  { path: 'registroEspecialista', component: RegistroEspecialistaComponent },
  { path: 'registro', component: RegistroComponent},
  { path: 'ingresar', component: IngresarComponent, data: { animation: 'Ingresar' }},
  { path: 'home', component: HomeComponent, data: { animation: 'Home' }},
  { path: '', component: HomeComponent, data: { animation: 'Home' }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
