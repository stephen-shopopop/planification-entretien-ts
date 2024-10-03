
export interface INotificationRepository {
  envoyerEmailDeConfirmationAuCandidat: (email: string) => Promise<boolean>
  envoyerEmailDeConfirmationAuRecruteur: (email: string) => Promise<boolean>
}
