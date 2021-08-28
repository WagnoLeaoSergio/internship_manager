package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findAllByUserId(long userId);
}
