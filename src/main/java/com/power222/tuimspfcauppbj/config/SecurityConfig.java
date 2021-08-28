package com.power222.tuimspfcauppbj.config;

import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.util.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Profile({"!withSecurityTests & !noSecurityTests"})
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(authenticationProvider());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                //Boilerplate
                .cors()
                .and()
                .csrf()
                .disable()
                //For h2-console
                .headers()
                .frameOptions()
                .sameOrigin()
                .and()
                .authorizeRequests()

                //For browser pre-flight requests
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                //React build
                .antMatchers("/", "/*.*", "/static/**").permitAll()

                //Always accessible enpoints
                .antMatchers(HttpMethod.POST, "/api/students").permitAll()
                .antMatchers(HttpMethod.POST, "/api/employers").permitAll()

                //Password update endpoint has built-in auth
                .antMatchers(HttpMethod.PUT, "/api/auth/password").permitAll()

                //Semesters
                .antMatchers(HttpMethod.GET, "/api/semesters", "/api/semesters/present").permitAll()

                .antMatchers("/api/admins", "/api/admins/**").hasRole("ADMIN")

                //Dev
                .antMatchers("/h2-console/*").permitAll()
                .antMatchers("/api/hello").permitAll()
                .antMatchers("/swagger-ui/", "/swagger-ui/**", "/swagger-ui/*.*", "/swagger-resources/**", "/v2/api-docs").permitAll()

                .anyRequest().fullyAuthenticated()
                .and()
                .httpBasic()
                .authenticationEntryPoint(new NoPopupBasicAuthenticationEntrypoint());
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsServiceImpl(userRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final var corsConfiguration = new CorsConfiguration().applyPermitDefaultValues();
        corsConfiguration.addAllowedMethod(HttpMethod.PUT);
        corsConfiguration.addAllowedMethod(HttpMethod.DELETE);
        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }
}
