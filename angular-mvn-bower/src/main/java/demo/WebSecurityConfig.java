package demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.SecurityConfigurer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.DefaultSecurityFilterChain;

import demo.xauth.XAuthTokenConfigurer;

@EnableWebMvcSecurity
@EnableWebSecurity(debug = false)
@Configuration
@Order
class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        
        String[] restEndpointsToSecure = { "news","personas"} ;
        for (String endpoint : restEndpointsToSecure) {
            http.authorizeRequests().antMatchers("/" + endpoint + "/**").hasRole(CustomUserDetailsService.ROLE_USER);
        }

        SecurityConfigurer<DefaultSecurityFilterChain, HttpSecurity> securityConfigurerAdapter = new XAuthTokenConfigurer(userDetailsServiceBean());
        http.apply(securityConfigurerAdapter);
    }
    
    @Autowired
    CustomUserDetailsService customUserDetailsService;
    
    @Override
    protected void configure(AuthenticationManagerBuilder authManagerBuilder) throws Exception {
    	authManagerBuilder.userDetailsService(customUserDetailsService);
    }

    @Bean
    @Override
    public UserDetailsService userDetailsServiceBean() throws Exception {
        return super.userDetailsServiceBean();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
