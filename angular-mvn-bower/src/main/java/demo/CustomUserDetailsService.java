package demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import demo.dao.UsuarioDAO;
import demo.dto.Usuario;


@Service // when DAO is sprng bean
class CustomUserDetailsService extends SpringBeanAutowiringSupport implements UserDetailsService {

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_USER = "USER";

    @Autowired
    UsuarioDAO usuarioDAO;

//    List<UserDetails> details = Arrays.<UserDetails>asList(
//    		new SimpleUserDetails("user", "user", ROLE_USER),
//    		new SimpleUserDetails("admin", "admin", ROLE_USER, ROLE_ADMIN));

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	
    	
    	Usuario usr = usuarioDAO.read(username);
    	UserDetails details = new SimpleUserDetails(usr.getUsername(), usr.getContrasenia(), ROLE_USER, usr.getRol());
    	return details;
    }
}
