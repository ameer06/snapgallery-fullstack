package com.snapgallery.config;

import com.snapgallery.event.Event;
import com.snapgallery.event.EventMember;
import com.snapgallery.event.EventMemberRepository;
import com.snapgallery.event.EventRepository;
import com.snapgallery.user.User;
import com.snapgallery.user.UserRepository;
import com.snapgallery.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Create Admin
            User admin = User.builder()
                    .name("Admin Lead")
                    .email("admin@snapgallery.demo")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(UserRole.ADMIN)
                    .build();
            admin = userRepository.save(admin);

            // Create Team Members
            User rahul = User.builder()
                    .name("Rahul Sharma")
                    .email("rahul@snapgallery.demo")
                    .passwordHash(passwordEncoder.encode("rahul123"))
                    .role(UserRole.TEAM_MEMBER)
                    .build();
            rahul = userRepository.save(rahul);

            User priya = User.builder()
                    .name("Priya Patel")
                    .email("priya@snapgallery.demo")
                    .passwordHash(passwordEncoder.encode("priya123"))
                    .role(UserRole.TEAM_MEMBER)
                    .build();
            priya = userRepository.save(priya);

            // Create Sample Event
            Event event = Event.builder()
                    .name("Arjun & Priya Wedding")
                    .description("Grand luxury palace wedding ceremony at Udaipur")
                    .eventDate(LocalDate.now().plusDays(10))
                    .location("Udaipur Palace, Rajasthan")
                    .coverPhotoUrl("https://images.unsplash.com/photo-1519741497674-611481863552?w=1200")
                    .createdBy(admin)
                    .build();
            event = eventRepository.save(event);

            // Assign Members
            eventMemberRepository.save(EventMember.builder().event(event).user(admin).build());
            eventMemberRepository.save(EventMember.builder().event(event).user(rahul).build());
            eventMemberRepository.save(EventMember.builder().event(event).user(priya).build());

            System.out.println(">>> Demo data successfully seeded <<<");
            System.out.println("Admin: admin@snapgallery.demo / admin123");
            System.out.println("Team Member 1: rahul@snapgallery.demo / rahul123");
            System.out.println("Team Member 2: priya@snapgallery.demo / priya123");
        }
    }
}
