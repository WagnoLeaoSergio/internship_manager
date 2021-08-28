package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.EmailContentsType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;
import java.util.Base64;

@Service
@Slf4j
public class MailSendingService {

    private final JavaMailSender javaMailSender;

    public MailSendingService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void notifyConcernedUsers(final Contract contract) {
        final var signatureState = contract.getSignatureState();

        switch (signatureState) {
            case WAITING_FOR_EMPLOYER_SIGNATURE:
                sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
                break;
            case REJECTED_BY_EMPLOYER:
                sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_REJECTION, contract, contract.getAdmin().getEmail());
                sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_REJECTION, contract, contract.getStudentApplication().getStudent().getEmail());
                break;
            case WAITING_FOR_STUDENT_SIGNATURE:
                sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getStudentApplication().getStudent().getEmail());
                break;
            case WAITING_FOR_ADMIN_SIGNATURE:
                sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_SIGNATURE, contract, contract.getAdmin().getEmail());
                break;
            case SIGNED:
            default:
                sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getAdmin().getEmail());
                sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
                sendEmail(EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT, contract, contract.getStudentApplication().getStudent().getEmail());
                break;
        }
    }

    public void notifyAboutCreation(final Contract contract) {
        sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_CONTRACT, contract, contract.getStudentApplication().getStudent().getEmail());
        sendEmail(EmailContentsType.NOTIFY_ABOUT_NEW_CONTRACT, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
    }

    public void notifyAboutCreation(final InternEvaluation internEvaluation) {
        sendEmail(EmailContentsType.NOTIFY_ABOUT_EVALUATION_CREATED, internEvaluation.getContract(), internEvaluation.getContract().getAdmin().getEmail());
    }

    public void notifyAboutDeletion(final Contract contract) {
        sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_DELETION, contract, contract.getStudentApplication().getStudent().getEmail());
        sendEmail(EmailContentsType.NOTIFY_ABOUT_CONTRACT_DELETION, contract, contract.getStudentApplication().getOffer().getEmployer().getEmail());
    }

    public void sendEmail(EmailContentsType emailContentsType, Contract contract, String recipientEmail) {
        MimeMessage mimeMessage = prepareMimeMessage(emailContentsType, contract, recipientEmail);
        javaMailSender.send(mimeMessage);
    }

    private MimeMessage prepareMimeMessage(EmailContentsType emailType, Contract contract, String recipientEmail) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        String messageSubject = getAppropriateEmailSubject(contract, emailType);
        String messageContents = getAppropriateEmailTextContent(contract, emailType);

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setTo(recipientEmail);
            helper.setSubject(messageSubject);
            helper.setText(messageContents, true);

            if (emailType == EmailContentsType.NOTIFY_AND_ATTACH_SIGNED_CONTRACT) {
                final InputStreamSource inSrc = () -> new ByteArrayInputStream(Base64.getMimeDecoder().decode(contract.getFile().split(",")[1]));
                helper.addAttachment("Contrat " + contract.getStudentApplication().getOffer().getTitle() + " - "
                                             + contract.getStudentApplication().getStudent().getFirstName() + " "
                                             + contract.getStudentApplication().getStudent().getLastName(), inSrc);
            }
        } catch (MessagingException e) {
            log.error("Impossible d'envoyer l'email: {}", e.getMessage());
        }
        return mimeMessage;
    }

    public String getAppropriateEmailSubject(final Contract contract, final EmailContentsType emailType) {
        String subjectSuffix = (emailType == EmailContentsType.NOTIFY_ABOUT_EVALUATION_CREATED) ? "" :
                (" - Oferta \"" + contract.getStudentApplication().getOffer().getTitle() + "\"" + " - "
                        + contract.getStudentApplication().getStudent().getFirstName() + " "
                        + contract.getStudentApplication().getStudent().getLastName());
        switch (emailType) {
            case NOTIFY_ABOUT_NEW_CONTRACT:
                return "NOVO CONTRATO" + subjectSuffix;
            case NOTIFY_ABOUT_CONTRACT_DELETION:
                return "CONTRATO APAGADO" + subjectSuffix;
            case NOTIFY_ABOUT_NEW_SIGNATURE:
                if (contract.getSignatureState() == ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE)
                    return "CONTRATO APROVADO - " + subjectSuffix;
                return "NOVA ASSINATURA PARA UM CONTRATO" + subjectSuffix;
            case NOTIFY_ABOUT_CONTRACT_REJECTION:
                return "CONTRATO REJEITADO" + subjectSuffix;
            case NOTIFY_AND_ATTACH_SIGNED_CONTRACT:
                return "CONTRATO ASSINADO" + subjectSuffix;
            case NOTIFY_ABOUT_EVALUATION_CREATED:
            default:
                return "NOVA AVALIAÇÃO DE ESTÁGIO";
        }
    }

    public String getAppropriateEmailTextContent(final Contract contract, final EmailContentsType emailType) {
        switch (emailType) {
            case NOTIFY_ABOUT_NEW_CONTRACT:
                return "Um contrato foi gerado para a oferta de estágio\"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "com o estudante " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName() + "."
                        + "<br/>Consulte o contrato em nosso sistema";
            case NOTIFY_ABOUT_CONTRACT_DELETION:
                return "O contrato de oferta de estágio \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "com o estudante " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName() + " "
                        + "foi excluído pela coordenação.";
            case NOTIFY_ABOUT_NEW_SIGNATURE:
                if (contract.getSignatureState() == ContractSignatureState.WAITING_FOR_EMPLOYER_SIGNATURE)
                    return "O contrato de oferta de estágio \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                            + "com o estudante " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName() + " "
                            + "foi aprovado pela coordenação.";
                return "Uma assinatura foi registrada no contrato para a oferta de estágio \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "com o estudante " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName() + "."
                        + "<br/>Consulte o contrato em nosso sistema";
            case NOTIFY_ABOUT_CONTRACT_REJECTION:
                return "O contrato de oferta de estágio \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "com o estudante " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName()
                        + "foi rejeitado pelo empregador pelo seguinte motivo :"
                        + "<br/>    " + contract.getReasonForRejection();
            case NOTIFY_AND_ATTACH_SIGNED_CONTRACT:
                return "O contrato de oferta de estágio \"" + contract.getStudentApplication().getOffer().getTitle() + "\" "
                        + "com o estudante " + contract.getStudentApplication().getStudent().getFirstName() + " " + contract.getStudentApplication().getStudent().getLastName()
                        + "foi assinado por todas as partes interessadas e está pronto."
                        + "<br/>Você vai encontrar em anexo.";
            case NOTIFY_ABOUT_EVALUATION_CREATED:
            default:
                return "Uma avaliação foi concluída para o aluno."
                        + "<br/>Por favor, veja a avaliação em nosso sistema.";

        }
    }
}
