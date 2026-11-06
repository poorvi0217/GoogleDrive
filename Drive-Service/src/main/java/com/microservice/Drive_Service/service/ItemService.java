package com.microservice.Drive_Service.service;

import com.microservice.Drive_Service.model.DriveItem;
import com.microservice.Drive_Service.repo.ItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class ItemService {

    private final ItemRepository itemRepository;


    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public DriveItem create(String name , UUID parentId , DriveItem.Kind kind , Long size , String mediaType){
        if(name==null || name.isBlank() || name.length() > 255 || name.equals(".") || name.equals("..")
            || name.contains("/") || name.contains("\\") || name.chars().anyMatch(Character::isISOControl)
        ){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Use proper name");
        }

        if(parentId==null){
            DriveItem parent = itemRepository.lockById(parentId).orElseThrow(ItemService::missing);
            if(parent.getKind()!=DriveItem.Kind.FOLDER || parent.getStatus()!=DriveItem.Status.READY){
                throw new ResponseStatusException(HttpStatus.CONFLICT,"Parent must be unavailable folder");
            }
        }
        return itemRepository.saveAndFlush(new DriveItem(name , parentId, kind, size, mediaType));
    }

    private static ResponseStatusException missing(){
        return  new ResponseStatusException(HttpStatus.NOT_FOUND,"Item not found");
    }
}
