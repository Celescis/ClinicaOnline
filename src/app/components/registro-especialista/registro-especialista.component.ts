import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Especialista } from 'src/app/class/especialista';
import { AuthService } from 'src/app/services/auth.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Administrador } from 'src/app/class/administrador';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.css']
})
export class RegistroEspecialistaComponent implements OnChanges {
  @Input() especialidad?: any;
  @Input() usuario?: any;
  @Input() dondeEsta?: boolean;
  @Input() admin?: boolean;

  administrador: Administrador = new Administrador('', '', 0, 0, '', '', []);
  especialista: Especialista = new Especialista('', '', 0, 0, '', '', '', [], false);
  form!: FormGroup;
  formLogin!: FormGroup;
  imageCount: number = 0;
  images: string[];
  registro: boolean = false;
  inputEspecialidades: string = "";
  spinner: boolean = false;
  apellidoValido: boolean = false;
  nameValido: boolean = false;
  edadValidada: boolean = false;
  dniValido: boolean = false;
  obraSocialValidada: boolean = false;
  passValido: boolean = false;
  correoValido: boolean = false;
  passValidoConf: boolean = false;
  captchaValido:boolean=false;
  captchaEscrito:string="";
  captcha: string = '';


  constructor(private formBuilder: FormBuilder,
    public firestoreService: FirestoreService,
    private swalService: SwalService,
    private storage: Storage,
    private authService: AuthService,
    private router: Router) {
      this.images = [];
      this.captcha = this.generateRandomString(6);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dondeEsta']) {
      this.dondeEsta = !this.dondeEsta;
    }
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      ap: ['', Validators.required],
      ed: ['', Validators.required],
      dni: ['', Validators.required],
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
      ft: ['', Validators.required],
      hb: ['', Validators.required],
    });
  }

  handleChangeCheckbox(value: boolean) {
    this.registro = value;
  }

  //REGISTRO
  async guardar() {
    if (!this.form.invalid && this.images.length>0) {
      this.spinner = true;

      this.especialista.nombre = this.form.value.nom;
      this.especialista.apellido = this.form.value.ap;
      this.especialista.edad = this.form.value.ed;
      this.especialista.dni = this.form.value.dni;
      this.especialista.mail = this.form.value.mail;
      this.especialista.password = this.form.value.pw;
      this.especialista.fotos = this.form.value.ft;

      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      const files: FileList | null = fileInput.files;

      if (files) {
        const file = files[0];
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');

        const urls: string[] = [];
        const fileName = `img1_${year}${month}${day}_${hours}${minutes}${seconds}`;

        if (!this.admin) {

          const imgRef = ref(this.storage, `especialistas/${this.especialista.dni}/${fileName}`);
          await uploadBytes(imgRef, file);


          const url = await getDownloadURL(imgRef);
          urls.push(url);

          this.especialista.especialidad = this.especialidad;
          this.especialista.habilitado = false;
          this.especialista.fotos = urls;

          this.spinner = false;
          this.firestoreService.guardarEsp(this.especialista);
        }
        else {
          const imgRef = ref(this.storage, `administradores/${this.especialista.dni}/${fileName}`);
          await uploadBytes(imgRef, file);

          const url = await getDownloadURL(imgRef);
          urls.push(url);

          this.especialista.fotos = urls;
          this.administrador.nombre = this.especialista.nombre;
          this.administrador.apellido = this.especialista.apellido;
          this.administrador.edad = this.especialista.edad;
          this.administrador.dni = this.especialista.dni;
          this.administrador.mail = this.especialista.mail;
          this.administrador.password = this.especialista.password;
          this.administrador.fotos = this.especialista.fotos;

          this.spinner=false;
          this.firestoreService.guardarAdmin(this.administrador);
        }
      } else {
        this.swalService.crearSwal('Debe seleccionar una imagen', 'DEBE SUBIR UNA IMAGEN', 'error');
      }
      
      this.limpiar();
    } else {
      this.swalService.crearSwal('Debe ingresar todos los datos', 'INCOMPLETO', 'warning');
    }
  }

  limpiar() {
    this.especialista = new Especialista('', '', 0, 0, '', '', '', [], false);
    this.form.reset();
    this.images = [];
    this.especialidad = null;
  }

  handleFileInputChange(event: any) {
    const files: FileList = event.target.files;

    if (files.length !== 1) {
      this.swalService.crearSwal('Debe subir solo una imagen', 'INCOMPLETO', 'warning');
      return;
    }
    this.images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      this.images.push(imageUrl);
    }
  }

  // clickListado($event: any) {
  //   this.inputEspecialidades = $event.join(' - ');
  //   this.especialidad = $event;
  // }
  clickListado($event: any) {
    //@ts-ignore
    this.inputEspecialidades = $event.map((especialidad) => especialidad.nombre).join(' - ');
    this.especialidad = $event;
  }

  //LOGIN
  loguear() {
    if (this.usuario.hasOwnProperty("habilitado")) {
      if (this.formLogin.value.hb == true) {
        this.authService.login(this.formLogin.value.mail, this.formLogin.value.pw, this.formLogin.value.ft[0], this.formLogin.value.nom, false);
      }
      else {
        this.swalService.crearSwal("Su cuenta no ha sido verificada por el Admin", "Error", "error");
      }
    }
    else if(this.usuario.hasOwnProperty("obraSocial")){
      this.authService.login(this.formLogin.value.mail, this.formLogin.value.pw, this.formLogin.value.ft[0], this.formLogin.value.nom, false);
    }
    else
    {
      this.authService.login(this.formLogin.value.mail, this.formLogin.value.pw, this.formLogin.value.ft[0], this.formLogin.value.nom, true);
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
      ft: this.usuario.fotos,
      hb: this.usuario.habilitado
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

  generateRandomString(num: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return result1;
  }
  
  
  validarCaptcha() {
    if (this.captchaEscrito == this.captcha) {
      this.captchaValido = true;
    } else {
      this.captchaValido = false;
    }
  }
}

