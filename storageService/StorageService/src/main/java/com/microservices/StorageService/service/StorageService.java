package com.microservices.StorageService.service;

import com.microservices.StorageService.repo.DataStore;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import java.io.IOException;
import java.util.UUID;

@Service
public class StorageService {

    private final DataStore dataStore;

    public StorageService(DataStore dataStore) {
        this.dataStore = dataStore;
    }

    public void put(UUID id , MultipartFile file) throws IOException{
        try(var input = file.getInputStream())
        {
            dataStore.put(id, input);
        }
    }

    public Resource get(UUID id){
        return dataStore.get(id);
    }

    public void delete(UUID id) throws IOException{
        dataStore.delete(id);
    }
}
