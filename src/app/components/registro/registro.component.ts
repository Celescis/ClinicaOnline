import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paciente } from 'src/app/class/paciente';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnChanges {
  @Input() usuario?: any;
  @Input() dondeEsta?: boolean;
  @Input() login?: boolean;
  @Input() esPaciente?: boolean;
  paciente: Paciente = new Paciente('', '', 0, 0, '', '', '', []);
  form!: FormGroup;
  formLogin!: FormGroup;
  images: string[];
  registro: boolean = false;
  autoCheck: boolean = false;
  spinner: boolean = false;
  apellidoValido: boolean = false;
  nameValido: boolean = false;
  edadValidada: boolean = false;
  dniValido: boolean = false;
  obraSocialValidada: boolean = false;
  passValido: boolean = false;
  correoValido: boolean = false;
  passValidoConf: boolean = false;

  constructor(private formBuilder: FormBuilder,
    public firestoreService: FirestoreService,
    private swalService: SwalService,
    private storage: Storage,
    private authService: AuthService,
    private router: Router) {
    this.images = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dondeEsta']) {
      this.dondeEsta = !this.dondeEsta;
    }
  }

  ngOnInit(): void {
    // if (this.login && !this.esPaciente) {
    //   this.registro = true;
    // }
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      ap: ['', Validators.required],
      ed: ['', Validators.required],
      dni: ['', Validators.required],
      os: ['', Validators.required],
      mail: ['', Validators.required],
      pw: ['', Validators.required],
      ft: ['', Validators.required]
    });

    this.formLogin = this.formBuilder.group({
      nom: ['', Validators.required],
      ap: ['', Validators.required],
      ed: ['', Validators.required],
      dni: ['', Validators.required],
      os: ['', Validators.required],
      mail: ['', Validators.required],
      pw: ['', Validators.required],
      ft: ['', Validators.required]
    });
  }

  handleChangeCheckbox(value: boolean) {
    this.registro = value;
  }

  async guardar() {
    if (!this.form.invalid && this.images.length == 2) {
      this.spinner = true;
      this.paciente.nombre = this.form.value.nom;
      this.paciente.apellido = this.form.value.ap;
      this.paciente.edad = this.form.value.ed;
      this.paciente.dni = this.form.value.dni;
      this.paciente.obraSocial = this.form.value.os;
      this.paciente.mail = this.form.value.mail;
      this.paciente.password = this.form.value.pw;
      this.paciente.fotos = this.form.value.ft;

      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      const files: FileList | null = fileInput.files;

      if (files) {
        const urls: string[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const day = currentDate.getDate().toString().padStart(2, '0');
          const hours = currentDate.getHours().toString().padStart(2, '0');
          const minutes = currentDate.getMinutes().toString().padStart(2, '0');
          const seconds = currentDate.getSeconds().toString().padStart(2, '0');

          const fileName = `img${i}_${year}${month}${day}_${hours}${minutes}${seconds}`;

          const imgRef = ref(this.storage, `pacientes/${this.paciente.dni}/${fileName}`);
          await uploadBytes(imgRef, file);

          const url = await getDownloadURL(imgRef);
          urls.push(url);
        }

        this.paciente.fotos = urls;

        this.spinner = false;
        this.firestoreService.guardar(this.paciente);
        
      } else {
        this.swalService.crearSwal('Debe seleccionar exactamente 2 imágenes', 'DEBE SUBIR LAS IMAGENES', 'error');
      }
      
      this.limpiar();
    } else {
      this.swalService.crearSwal('Debe ingresar todos los datos', 'INCOMPLETO', 'warning');
    }
  }

  limpiar() {
    this.paciente = new Paciente('', '', 0, 0, '', '', '', []);
    this.form.reset();
    this.images = [];
  }

  handleFileInputChange(event: any) {
    const files: FileList = event.target.files;

    if (files.length !== 2) {
      this.swalService.crearSwal('Debe subir 2 imagenes', 'INCOMPLETO', 'warning');
      return;
    }

    this.images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      this.images.push(imageUrl);
    }
  }

  //LOGIN
  loguear() {
    if (this.login && !this.usuario.hasOwnProperty('obraSocial') && !this.usuario.hasOwnProperty('especialidad')) {
      this.authService.login(this.formLogin.value.mail, this.formLogin.value.pw, this.formLogin.value.ft[0], this.formLogin.value.nom, true);
    } else {
      this.authService.login(this.formLogin.value.mail, this.formLogin.value.pw, this.formLogin.value.ft[0], this.formLogin.value.nom, false);
    }

  }

  clickListadoUsuarios($event: any) {
    this.usuario = $event;

    this.formLogin.patchValue({
      nom: this.usuario.nombre,
      ap: this.usuario.apellido,
      ed: this.usuario.edad,
      dni: this.usuario.dni,
      os: this.usuario.obraSocial,
      mail: this.usuario.mail,
      pw: this.usuario.password,
      ft: this.usuario.fotos
    });
  }


  validarDni() {
    if (this.form.value.dni > 999999 && this.form.value.dni < 100000000) {
      this.dniValido = true;
    } else {
      this.dniValido = false;
    }
  }

  validarApellido() {
    if (this.form.value.ap.match(/[a-zA-Z]/) && this.form.value.ap.length < 15 && this.form.value.ap.length > 2) {
      this.apellidoValido = true;
    } else {
      this.apellidoValido = false;
    }
  }

  validarObraSocial() {
    if (this.form.value.os.match(/[a-zA-Z]/) && this.form.value.os.length < 20 && this.form.value.os.length > 2) {
      this.obraSocialValidada = true;
    } else {
      this.obraSocialValidada = false;
    }
  }

  validarEdad() {
    if (this.form.value.ed > 17 && this.form.value.ed < 100) {
      this.edadValidada = true;
    } else {
      this.edadValidada = false;
    }
  }

  validarName() {
    if (this.form.value.nom.match(/[a-zA-Z]/) && this.form.value.nom.length < 15 && this.form.value.nom.length > 2) {
      this.nameValido = true;
    } else {
      this.nameValido = false;
    }
  }

  validarPass() {
    if (this.form.value.pw.match(/[0-9a-zA-Z]{6,}/)) {
      this.passValido = true;
    } else {
      this.passValido = false;
    }
  }

  validarCorreo() {
    if (this.form.value.mail.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/) && this.form.value.mail.length > 6) {
      this.correoValido = true;
    } else {
      this.correoValido = false;
    }
  }
  volverMenuPrincipal() {
    this.router.navigate(['/ingresar']);
  }
}



