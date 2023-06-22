import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEspecialistaComponent } from './registro-especialista.component';

describe('RegistroEspecialistaComponent', () => {
  let component: RegistroEspecialistaComponent;
  let fixture: ComponentFixture<RegistroEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroEspecialistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
