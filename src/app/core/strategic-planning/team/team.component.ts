import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Team } from 'src/app/models/Team';
import { AiGenerationService } from 'src/app/services/ai-generation.service';
import { TeamService } from 'src/app/services/team.service';
import { AiResponseDialogComponent } from '../ai-response-dialog/ai-response-dialog.component';
import { TeamDetailComponent } from '../team-detail/team-detail.component';
import { Currency } from 'src/app/enumerations/currency.enum';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  
  teamMembers: Team[] = [];
  aiResponsesMap: { [memberId: string]: string } = {};

  companyId: string | undefined = localStorage.getItem('selectedCompanyId') ?? undefined;


  constructor(
    private teamService: TeamService,
    private dialogService: NbDialogService,
    private aiService: AiGenerationService
  ) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    if (!this.companyId) return;

    this.teamService.getByCompany(this.companyId).subscribe(members => {
      this.teamMembers = members;

      // Appel IA pour chaque membre
      members.forEach(member => {
        if (member.id) {
          this.aiService.getAIResponse('TEAM', member.id).subscribe({
            next: res => this.aiResponsesMap[member.id!] = res.aiResponse,
            error: err => {
              this.aiResponsesMap[member.id!] = 'Aucune réponse IA.';
              console.error(`Erreur IA pour ${member.id}`, err);
            },
          });
        }
      });
    });
  }

  showAIResponse(memberId: string): void {
    const content = this.aiResponsesMap[memberId] || 'Aucune réponse IA.';

    this.dialogService.open(AiResponseDialogComponent, {
      context: { aiResponse: content },
    });
  }

  openAddMemberDialog(): void {
    this.dialogService.open(TeamDetailComponent, {
      context: {
        companyId: this.companyId   // ⬅️ très important
      }
    }).onClose.subscribe(res => {
      if (res) this.loadMembers();
    });
  }

  editMember(member: Team): void {
    this.dialogService.open(TeamDetailComponent, {
      context: {
        memberToEdit: member,
        companyId: this.companyId
      }
    }).onClose.subscribe(updated => {
      if (updated) this.loadMembers();
    });
  }

  deleteMember(id: string): void {
    if (confirm('Confirmer la suppression ?')) {
      this.teamService.delete(id).subscribe(() => this.loadMembers());
    }
  }

  getCurrencySymbol(currency?: Currency): string {
    switch (currency) {
      case Currency.EUR: return '€';
      case Currency.USD: return '$';
      case Currency.TND: return 'DT';
      default: return '';
    }
  }

}