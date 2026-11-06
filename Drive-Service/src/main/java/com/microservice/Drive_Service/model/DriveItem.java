package com.microservice.Drive_Service.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
public class DriveItem {

    public enum Kind {FILE , FOLDER};

    public enum Status {PENDING , READY, DELETING}

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    private UUID parentID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Kind kind;

    private long size;
    private String mediaPlayer;

    @Column(nullable = false)
    private Instant createAt;

    @Version
    private Long version;

    protected DriveItem(){}

    public DriveItem(String name  , UUID parentID , Kind kind , Long size , String mediaPlayer){
        this.id = UUID.randomUUID();
        this.name= name;
        this.parentID = parentID;
        this.size = size;
        this.mediaPlayer = mediaPlayer;
        this.status = kind == Kind.FOLDER ? Status.READY : Status.PENDING;
        this.createAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getParentID() {
        return parentID;
    }

    public void setParentID(UUID parentID) {
        this.parentID = parentID;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Kind getKind() {
        return kind;
    }

    public void setKind(Kind kind) {
        this.kind = kind;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public String getMediaPlayer() {
        return mediaPlayer;
    }

    public void setMediaPlayer(String mediaPlayer) {
        this.mediaPlayer = mediaPlayer;
    }

    public Instant getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Instant createAt) {
        this.createAt = createAt;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }


}





