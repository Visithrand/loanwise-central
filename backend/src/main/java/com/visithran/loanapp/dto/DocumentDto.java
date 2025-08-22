package com.visithran.loanapp.dto;

import com.visithran.loanapp.entity.ApplicationDocument;
import lombok.Data;

@Data
public class DocumentDto {
    private Long id;
    private String documentName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    
    public static DocumentDto fromDocument(ApplicationDocument document) {
        DocumentDto dto = new DocumentDto();
        dto.setId(document.getId());
        dto.setDocumentName(document.getDocumentName());
        dto.setFileUrl(document.getFileUrl());
        dto.setFileType(document.getFileType());
        dto.setFileSize(document.getFileSize());
        return dto;
    }
}
