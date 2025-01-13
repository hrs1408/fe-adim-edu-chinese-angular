import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  isEditing = false;
  selectedUserId: number | null = null;
  showUserForm = false;
  searchTerm = '';

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      role: ['user', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    // Mock data - sẽ được thay thế bằng API call
    this.users = [
      {
        id: 1,
        email: 'admin@example.com',
        fullName: 'Admin User',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 2,
        email: 'user@example.com',
        fullName: 'Normal User',
        role: 'user',
        status: 'active',
        createdAt: new Date('2024-01-02')
      }
    ];
  }

  openAddUserForm(): void {
    this.isEditing = false;
    this.selectedUserId = null;
    this.userForm.reset({
      role: 'user',
      status: 'active'
    });
    this.showUserForm = true;
  }

  openEditUserForm(user: User): void {
    this.isEditing = true;
    this.selectedUserId = user.id;
    this.userForm.patchValue({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status
    });
    this.showUserForm = true;
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const formData = this.userForm.value;

    if (this.isEditing && this.selectedUserId) {
      // Update existing user
      const index = this.users.findIndex(u => u.id === this.selectedUserId);
      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          ...formData
        };
      }
    } else {
      // Add new user
      const newUser: User = {
        id: this.users.length + 1,
        ...formData,
        createdAt: new Date()
      };
      this.users.unshift(newUser);
    }

    this.closeUserForm();
  }

  deleteUser(userId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.users = this.users.filter(user => user.id !== userId);
    }
  }

  get filteredUsers(): User[] {
    return this.users.filter(user =>
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
