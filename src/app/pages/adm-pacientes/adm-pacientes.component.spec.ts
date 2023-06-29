import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPacientesComponent } from './adm-pacientes.component';

describe('AdmPacientesComponent', () => {
  let component: AdmPacientesComponent;
  let fixture: ComponentFixture<AdmPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmPacientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
