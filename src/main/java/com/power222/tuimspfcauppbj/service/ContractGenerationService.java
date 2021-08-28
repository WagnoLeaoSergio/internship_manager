package com.power222.tuimspfcauppbj.service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.WebColors;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.power222.tuimspfcauppbj.model.Admin;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.util.ContractDTO;
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.PDPageContentStream.AppendMode;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.util.filetypedetector.FileType;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Locale;
import java.util.Optional;

import static com.itextpdf.io.codec.Base64.encodeBytes;
import static com.power222.tuimspfcauppbj.util.ContractSignatureState.PENDING_FOR_ADMIN_REVIEW;
import static com.power222.tuimspfcauppbj.util.ContractSignatureState.getNextState;

@SuppressWarnings("MagicNumber")
@Service
@Slf4j
public class ContractGenerationService {

    public static final DateTimeFormatter DTF_WITH_TIME = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm", Locale.US);
    public static final DateTimeFormatter DTF_WITHOUT_TIME = DateTimeFormatter.ofPattern("dd-MM-yyyy", Locale.US);

    private final ContractService contractService;
    private final StudentApplicationService applicationService;
    private final NotificationService notifService;
    private final AuthenticationService authService;

    public ContractGenerationService(ContractService contractService, StudentApplicationService applicationService, NotificationService notifService, final AuthenticationService authService) {
        this.contractService = contractService;
        this.applicationService = applicationService;
        this.notifService = notifService;
        this.authService = authService;
    }

    public boolean generateContract(ContractDTO contractDto) {
        if (!(authService.getCurrentUser() instanceof Admin))
            return false;
        return generateContract(contractDto, (Admin) authService.getCurrentUser());
    }

    public boolean generateContract(ContractDTO contractDto, Admin admin) {
        Optional<StudentApplication> optionalApplication = getStudentApplication(contractDto);
        ByteArrayOutputStream stream = null;
        if (optionalApplication.isPresent()) {
            StudentApplication studentApplication = optionalApplication.get();
            stream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(stream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            document.add(new Paragraph("CONTRATO DE ESTÁGIO").setBold().setFontSize(20).setTextAlignment(TextAlignment.CENTER).setMarginTop(document.getPageEffectiveArea(PageSize.A4).getHeight() / 2));
            document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
            Paragraph paragraph = new Paragraph(new Text("ACORDO DE ESTÁGIO ENTRE AS SEGUINTES PARTES \n\n").setBold()).setPaddingTop(30f).add(new Text("As partes mencionadas abaixo: \n\n")).add("Coordenação de estágio, " + admin.getName() + "\n\n").add(new Text("e\n\n\n").setBold()).add(new Text("Supervisor de estágio, " + studentApplication.getOffer().getEmployer().getCompanyName() + "\n\n")).add(new Text("e\n\n\n").setBold()).add(new Text("Estudante, " + studentApplication.getStudent().getFirstName() + " " + studentApplication.getStudent().getLastName() + "\n\n")).add(new Text("Concordam com as seguintes condições de estágio : "));
            document.add(paragraph.setTextAlignment(TextAlignment.CENTER));
            insertInternshipInfoTable(studentApplication, contractDto.getTotalHoursPerWeek(), document);
            document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
            document.add(new Paragraph(new Text("TAREFAS E RESPONSABILIDADES DO ESTAGIÁRIO\n").setBold()));
            float documentWidth = document.getPageEffectiveArea(PageSize.A4).getWidth();
            final var table = new Table(1).setWidth(documentWidth);
            table.addCell(new Paragraph(studentApplication.getOffer().getDetails().getDescription()));
            document.add(table);

            internshipPartiesResponsabilities(contractDto, document);

            document.add(new Div().setTextAlignment(TextAlignment.JUSTIFIED)
                    .add(new Paragraph("ASSINATURAS - VER PRÓXIMA PÁGINA\n").setBold())
                    .setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))
                    .setWidth(documentWidth).setHeight(40f)
                    .setFixedPosition(100, 100, UnitValue.createPercentValue(100)));

            document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));

            document.add(new Div().setTextAlignment(TextAlignment.JUSTIFIED)
                    .add(new Paragraph("ASSINATURAS\n").setBold())
                    .setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))
                    .setWidth(documentWidth)
                    .setHeight(40f))
                    .add(new Paragraph().add(new Text("As partes comprometem-se a honrar este acordo de estágio. Em testemunho do que as partes assinaram,")
                            .setBold()
                            .setTextAlignment(TextAlignment.CENTER))
                            .setFirstLineIndent(15f));
            document.add(new Paragraph().add(new Text("\n\nSupervisor :\n").setBold()).setMarginBottom(75f))
                    .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4))
                    .add(new Paragraph().add(new Paragraph("Date").setMarginLeft(290f)));
            document.add(new Paragraph().add(new Text("\nEstudante :\n").setBold()).setMarginBottom(75f)
                    .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4)))
                    .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4))
                    .add(new Paragraph().add(new Paragraph("Date\n").setMarginLeft(290f)));
            document.add(new Paragraph().add(new Text("Coordenação de estágio :\n").setBold()).setMarginBottom(75f))
                    .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4))
                    .add(new Paragraph().add(new Paragraph("Date").setMarginLeft(290f)));

            document.close();
            String fileBase64 = encodeBytes(stream.toByteArray());
            contractDto.setFile("data:application/pdf;base64," + fileBase64);
            contractService.createAndSaveNewContract(contractDtoToContract(contractDto, studentApplication, admin));
        }
        return stream != null;
    }

    public Optional<Contract> signContract(ContractSignatureDTO signatureDto) {
        return contractService.getContractById(signatureDto.getContractId())
                .flatMap(contract -> performSignature(contract, signatureDto));
    }

    private Optional<Contract> performSignature(Contract contract, ContractSignatureDTO signatureDto) {
        if (contract.getSignatureState() != PENDING_FOR_ADMIN_REVIEW) {
            if (signatureDto.isApproved()) {
                final String signedFile = getContractFileWithSignature(contract, signatureDto);
                if (signedFile == null)
                    return Optional.empty();
                contract.setFile(signedFile);
            } else
                contract.setReasonForRejection(signatureDto.getReasonForRejection());
        }

        contract.setSignatureState(getNextState(contract.getSignatureState(), signatureDto.isApproved()));

        final var signedContract = contractService.updateContract(contract.getId(), contract);
        signedContract.ifPresent(notifService::notifyContractUpdate);
        return signedContract;
    }

    private String getContractFileWithSignature(Contract contract, ContractSignatureDTO signatureDto) {
        ByteArrayOutputStream out = null;

        try {
            PDDocument document = PDDocument.load(new ByteArrayInputStream(Base64.getMimeDecoder().decode(contract.getFile().split(",")[1])));
            PDPage page = document.getPage(document.getNumberOfPages() - 1);
            PDImageXObject image = PDImageXObject.createFromByteArray(document, Base64.getMimeDecoder().decode(signatureDto.getImageSignature().split(",")[1]), FileType.PNG.name());
            PDPageContentStream contentStream = new PDPageContentStream(document, page, AppendMode.APPEND, true);

            var state = contract.getSignatureState().name().toLowerCase();
            var initialYPosition = (state.contains("employer") ? 600f : (state.contains("student") ? 460f : 330f));

            contentStream.drawImage(image, 75, initialYPosition, image.getWidth() / (image.getHeight() / 60f), 60f);

            contentStream.beginText();
            contentStream.setFont(PDType1Font.TIMES_ROMAN, 16);
            contentStream.newLineAtOffset(330, initialYPosition);
            contentStream.showText(ZonedDateTime.now().format(DTF_WITH_TIME));
            contentStream.newLineAtOffset(-270, -40);
            contentStream.showText(signatureDto.getNomSignataire());
            contentStream.endText();

            contentStream.close();

            out = new ByteArrayOutputStream();
            document.save(out);
            document.close();
        }
        catch (Exception e) {
            log.error("Não foi possível registrar uma assinatura uma assinatura: {}", e.getMessage());
        }

        return (out == null) ? null : ("data:application/pdf;base64," + encodeBytes(out.toByteArray()));
    }

    public Optional<StudentApplication> getStudentApplication(ContractDTO contract) {
        return applicationService.getApplicationById(contract.getStudentApplicationId());
    }

    private Contract contractDtoToContract(ContractDTO contractDto, StudentApplication application, Admin admin) {
        Contract contract = new Contract();
        contract.setAdmin(admin);
        contract.setFile(contractDto.getFile());
        contract.setEngagementCollege(contractDto.getEngagementCollege());
        contract.setEngagementCompany(contractDto.getEngagementCompany());
        contract.setEngagementStudent(contractDto.getEngagementStudent());
        contract.setTotalHoursPerWeek(contractDto.getTotalHoursPerWeek());
        contract.setStudentApplication(application);
        return contract;
    }

    private void insertInternshipInfoTable(StudentApplication application, float weeklyHours, Document document) {
        InternshipOffer offer = application.getOffer();
        Table internshipInfoTable = new Table(1).setWidth(500f);
        internshipInfoTable.setBorder(new SolidBorder(1f));
        internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                .add(new Paragraph("LOCALIZAÇÃO DO ESTÁGIO").setBold().setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
        internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                .add(new Paragraph("Endereço : " + application.getOffer().getEmployer().getAddress()).setMultipliedLeading(1.2f)));

        internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                .add(new Paragraph("DURAÇÃO DO ESTÁGIO").setBold().setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
        internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                .add(new Paragraph("Data de início : " + parseDate(offer.getDetails().getInternshipStartDate()) +
                        "\nDate do término: " + parseDate(offer.getDetails().getInternshipEndDate())
                        + "\nNúmero total de semanas : " + dateIntervalToWeeks(offer.getDetails().getInternshipStartDate(), offer.getDetails().getInternshipEndDate()) + "\n").setMultipliedLeading(1.2f)));

        internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                .add(new Paragraph("HORÁRIO DE TRABALHO").setBold().setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
        internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                .add(new Paragraph("Horário de trabalho : " + application.getOffer().getDetails().getStartTime() +
                        "-" + application.getOffer().getDetails().getEndTime() +
                        "\nTotal de horas trabalhadas por semana: " + weeklyHours + "h\n").setMultipliedLeading(1.2f)));

        internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                .add(new Paragraph("SALÁRIO").setBold().setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
        internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                .add(new Paragraph("Salário : " + offer.getDetails().getSalary() + "$").setMultipliedLeading(1.2f)));
        document.add(internshipInfoTable);
    }

    @SneakyThrows
    private void internshipPartiesResponsabilities(ContractDTO contract, Document document) {
        PdfFont font = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
        document.add(new Paragraph(new Text("RESPONSABILIDADES\n").setBold()).setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph(new Text("A universidade está comprometido com :\n").setBold())
                .add(new Paragraph(contract.getEngagementCollege())).setFont(font)
                .add(new Text("\nA empresa está comprometida com :\n").setBold())
                .add(new Paragraph(contract.getEngagementCompany()))
                .add(new Text("\nO estudante está comprometido com :\n").setBold())
                .add(new Paragraph(contract.getEngagementStudent()))
        );
    }

    private String parseDate(LocalDate date) {
        return date.format(DTF_WITHOUT_TIME);
    }

    private long dateIntervalToWeeks(LocalDate startDate, LocalDate endDate) {
        return ChronoUnit.WEEKS.between(startDate, endDate);
    }
}
