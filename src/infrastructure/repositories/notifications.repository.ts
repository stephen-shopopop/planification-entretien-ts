import type { INotificationRepository } from "../../domain/port/notification-repository";

export class NotificationService implements INotificationRepository {

    async envoyerEmailDeConfirmationAuCandidat(email: string) {
        return Promise.resolve(true);
    }

    async envoyerEmailDeConfirmationAuRecruteur(email: string) {
        return Promise.resolve(true);
    }
}

export const notificationRepository =  new NotificationService();
