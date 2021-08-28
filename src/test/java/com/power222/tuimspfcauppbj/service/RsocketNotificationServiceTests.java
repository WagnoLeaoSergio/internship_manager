package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.NotificationRepository;
import com.power222.tuimspfcauppbj.model.Notification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RsocketNotificationServiceTests {

    @Mock
    private NotificationRepository repo;

    @InjectMocks
    private RsocketNotificationService svc;

    @Test
    void subscribeForUserTest() {
        final var notif = new Notification(UUID.randomUUID(), 1L, "Test message");
        when(repo.findAllByUserId(notif.getUserId())).thenReturn(Collections.singletonList(notif));

        var actual = svc.subscribeForUser(notif.getUserId());

        StepVerifier.create(actual)
                .expectNextMatches(notif::equals)
                .verifyTimeout(Duration.of(1, ChronoUnit.SECONDS));
    }

    @Test
    void multipleSubscribeForUserTest() {
        final var notif = new Notification(UUID.randomUUID(), 1L, "Test message");
        when(repo.findAllByUserId(notif.getUserId())).thenReturn(Collections.singletonList(notif));

        var actual = svc.subscribeForUser(notif.getUserId());
        var actual2 = svc.subscribeForUser(notif.getUserId());

        StepVerifier.create(actual)
                .expectNextMatches(notif::equals)
                .verifyTimeout(Duration.of(1, ChronoUnit.SECONDS));

        StepVerifier.create(actual2)
                .expectNextMatches(notif::equals)
                .verifyTimeout(Duration.of(1, ChronoUnit.SECONDS));
    }

    @Test
    void subscribeForUserOnErrorTest() {
        when(repo.findAllByUserId(anyLong())).thenReturn(Collections.singletonList(null));

        var actual = svc.subscribeForUser(0);

        StepVerifier.create(actual)
                .expectError(NullPointerException.class)
                .verify();
    }

    @Test
    void subscribeToAcksTest() {
        var uuid = UUID.fromString("ABCDE000-0000-0000-0000-000000000000");
        var publisher = TestPublisher.<UUID>create();
        svc.subscribeToAcks(publisher.flux());

        publisher.next(uuid);
        publisher.complete();

        verify(repo, times(1)).deleteById(uuid);
    }

    @Test
    void subscribeToAcksZeroUUIDTest() {
        var uuid = UUID.fromString("00000000-0000-0000-0000-000000000000");
        var publisher = TestPublisher.<UUID>create();
        svc.subscribeToAcks(publisher.flux());

        publisher.next(uuid);
        publisher.complete();

        verify(repo, times(0)).deleteById(uuid);
    }

    @Test
    void notifyTest() {
        final var userId = 1L;
        final var message = "Test message";
        svc.subscribeForUser(userId).subscribe();

        svc.notify(userId, message);

        verify(repo, times(1)).save(any(Notification.class));
    }

    @Test
    void notifyNoSinkTest() {
        final var userId = 1L;
        final var message = "Test message";

        svc.notify(userId, message);

        verify(repo, times(1)).save(any(Notification.class));
    }
}