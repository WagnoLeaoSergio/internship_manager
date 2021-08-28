package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Notification;
import com.power222.tuimspfcauppbj.service.RsocketNotificationService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Controller
public class NotificationController {

    private final RsocketNotificationService svc;

    public NotificationController(RsocketNotificationService svc) {
        this.svc = svc;
    }

    @MessageMapping("notif/{userId}")
    public Flux<Notification> notifications(Flux<UUID> acknowledgements, @DestinationVariable long userId) {
        svc.subscribeToAcks(acknowledgements);

        return svc.subscribeForUser(userId);
    }
}
