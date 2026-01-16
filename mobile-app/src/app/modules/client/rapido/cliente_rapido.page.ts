import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonInput, IonButton, 
  IonIcon, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonToast, 
  IonSpinner, IonBackButton, IonButtons,
  IonChip, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, arrowBack, cash, card } from 'ionicons/icons';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs'; // 👈 AÑADIR esta importación

@Component({
  selector: 'app-cliente-rapido',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton,
    IonIcon, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonToast,
    IonSpinner, IonBackButton, IonButtons,
    IonChip, IonText
  ],
  templateUrl: './cliente_rapido.page.html',
  styleUrls: ['./cliente_rapido.page.scss']
})
export class ClienteRapidoPage {
  cliente = {
    nombre: '',
    apellido: '',
    celular: ''
  };

  loading = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  
  clienteCreado: any = null;
  
  // URL base del backend en Render
  private apiUrl = 'https://gym-app-n77p.onrender.com/api';

  constructor(
    private router: Router,
    private http: HttpClient // ✅ HttpClient inyectado
  ) {
    addIcons({ checkmarkCircle, arrowBack, cash, card });
  }

  async crearCliente() {
    // Validaciones
    if (!this.cliente.nombre.trim()) {
      this.mostrarToast('Ingresa el nombre', 'warning');
      return;
    }
    
    if (!this.cliente.apellido.trim()) {
      this.mostrarToast('Ingresa el apellido', 'warning');
      return;
    }
    
    if (!this.cliente.celular.trim()) {
      this.mostrarToast('Ingresa el celular', 'warning');
      return;
    }

    this.loading = true;

    try {
      // ✅ USAR HttpClient en lugar de fetch (CONSISTENCIA)
      const data = await lastValueFrom(
        this.http.post(`${this.apiUrl}/clientes/rapido`, {
          nombre: this.cliente.nombre,
          apellido: this.cliente.apellido,
          celular: this.cliente.celular
        })
      ) as any;

      if (data.success) {
        this.clienteCreado = data.data;
        this.mostrarToast(`✅ Cliente creado • Pago: $24,000`, 'success');
        
        // Redirigir a lista de clientes
        setTimeout(() => {
          this.router.navigate(['/admin/members'], {
            state: { 
              nuevoCliente: true,
              datosCliente: this.clienteCreado
            }
          });
        }, 1500);
      } else {
        this.mostrarToast(`❌ ${data.message || 'Error desconocido'}`, 'danger');
      }
    } catch (error: any) {
      console.error('Error:', error);
      
      // Mensaje específico para timeout de Render
      if (error.name === 'HttpErrorResponse') {
        if (error.status === 0) {
          this.mostrarToast('❌ Error de conexión. Verifica que el servidor esté activo (Render puede estar iniciando)', 'warning');
        } else {
          this.mostrarToast(`❌ Error del servidor: ${error.status}`, 'danger');
        }
      } else {
        this.mostrarToast(`❌ Error: ${error.message}`, 'danger');
      }
    } finally {
      this.loading = false;
    }
  }

  mostrarToast(mensaje: string, color: string = 'success') {
    this.toastMessage = mensaje;
    this.toastColor = color;
    this.showToast = true;
  }
}