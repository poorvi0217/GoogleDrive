package com.microservice.Drive_Service.service;

import com.microservice.Drive_Service.client.StorageClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


@Service
public class DriveService {

    private static  final Logger log= LoggerFactory.getLogger(DriveService.class);
    private final ItemService itemService;

    public DriveService(ItemService itemService) {
        this.itemService = itemService;
    }

    private StorageClient storageClient;
}
