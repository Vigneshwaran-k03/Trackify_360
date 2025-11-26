import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Role } from '../role/role.entity';
import { Department } from '../dept/dept.entity';
import { RoleService } from '../role/role.service';
import { DeptService } from '../dept/dept.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly roleService: RoleService,
    private readonly deptService: DeptService,
    private readonly mail: MailService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { name } });
  }

  async createUser(body: any): Promise<User> {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Request body is required');
    }
    const { name, email, password, dept_id, dept, role_id, role } = body;
    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      throw new BadRequestException('Password is required');
    }
    const hash = await bcrypt.hash(password, 10);

    // If role_id or role name is provided, validate and get the role
    let roleEntity: Role | null = null;
    if (role_id) {
      roleEntity = await this.roleService.findRoleById(role_id);
    } else if (role) {
      try {
        roleEntity = await this.roleService.findRoleByName(role);
      } catch (error) {
        // Role doesn't exist, create it
        roleEntity = await this.roleService.createRole(role);
      }
    }

    // If dept_id or dept name is provided, validate and get the department
    let deptEntity: Department | null = null;
    if (dept_id) {
      deptEntity = await this.deptService.findDepartmentById(dept_id);
    } else if (dept) {
      try {
        deptEntity = await this.deptService.findDepartmentByName(dept);
      } catch (error) {
        // Department doesn't exist, create it
        deptEntity = await this.deptService.createDepartment(dept);
      }
    }

    const userData = {
      name,
      email,
      password: hash,
      dept_id: deptEntity?.id || null,
      dept: deptEntity?.name || dept || null,
      role_id: roleEntity?.id || null,
      role: roleEntity?.role_name || role || null,
    };
    const saved = await this.userRepo.save(userData as any);

    // Fire-and-forget credentials email
    if (email) {
      const subject = 'Your Trackify 360 account details';
      const plainPassword = String(password);
      const greetingName = name || 'User';
      const text = `Hello ${greetingName},\n\nYour Trackify 360 account has been created. Use the details below to log in:\n\nLogin page: http://localhost:5173/login\nEmail: ${email}\nPassword: ${plainPassword}\n\nAfter you log in, you can change this password from your account settings for better security.`;
      const html = `<p>Hello ${greetingName},</p>
<p>Your Trackify 360 account has been created. Use the details below to log in:</p>
<p>
  <strong>Login page:</strong> <a href="http://localhost:5173/login">http://localhost:5173/login</a><br/>
  <strong>Email:</strong> ${email}<br/>
  <strong>Password:</strong> ${plainPassword}
</p>
<p>After you log in, you can change this password from your account settings for better security.</p>`;
      this.mail.sendMail({ to: email, subject, text, html }).catch(() => {});
    }

    return saved;
  }

  async getRoles(): Promise<Role[]> {
    return await this.roleService.findAllRoles();
  }

  async getDepartments(): Promise<Department[]> {
    return await this.deptService.findAllDepartments();
  }

  async getManagers(): Promise<User[]> {
    return await this.userRepo.find({
      where: { role: 'Manager' },
      select: ['user_id', 'name', 'email', 'dept']
    });
  }
  
  async getAdmins(): Promise<User[]> {
    return await this.userRepo.find({
      where: { role: 'Admin' },
      select: ['user_id', 'name', 'email', 'dept']
    });
  }
  
  async getManagersByDepartment(dept: string): Promise<User[]> {
    return await this.userRepo.find({
      where: { dept, role: 'Manager' },
      select: ['user_id', 'name', 'email', 'dept']
    });
  }

  async getEmployeesByDepartment(dept: string): Promise<User[]> {
    return await this.userRepo.find({
      where: { dept, role: 'Employee' },
      select: ['user_id', 'name', 'email', 'dept']
    });
  }

  async updatePasswordByEmail(email: string, newPassword: string): Promise<void> {
    if (!email || !newPassword) throw new BadRequestException('Email and newPassword are required');
    const user = await this.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    const hash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update({ email }, { password: hash } as any);
  }

  async updateAvatarByUserId(userId: number, avatar: string): Promise<void> {
    if (!userId || !avatar) throw new BadRequestException('userId and avatar are required');
    await this.userRepo.update({ user_id: userId } as any, { avatar } as any);
  }

  async updateAvatarByEmail(email: string, avatar: string): Promise<void> {
    if (!email || !avatar) throw new BadRequestException('email and avatar are required');
    await this.userRepo.update({ email } as any, { avatar } as any);
  }
}
