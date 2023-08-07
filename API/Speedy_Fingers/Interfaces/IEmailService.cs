using Speedy_Fingers.Helper;

namespace Speedy_Fingers.Interfaces
{
    public interface IEmailService
    {
        void SendEmail(EmailMessage emailMessage);
    }
}
