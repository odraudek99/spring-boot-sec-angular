package demo;

import org.apache.commons.cli.BasicParser;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;


@ComponentScan
@EnableAutoConfiguration
public class Application extends SpringBootServletInitializer {

    private static Class<Application> entryPointClass = Application.class;

    public static final boolean seguridad = false;
    

	 static Options options = new Options();
	 static boolean security = false;
	 
    public static void main(String[] args) {
        
    	 options.addOption("h", "help", false, "show help.");
    	 options.addOption("s", "security", false, "Enable security.");
    	  
    	 parse(args);
    	
    	 SpringApplication.run(entryPointClass, args);
        
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(entryPointClass);
    }
    
    public static void parse(String[] args) {
    	
    	  CommandLineParser parser = new BasicParser();
    	  CommandLine cmd = null;
    	  try {
    	   cmd = parser.parse(options, args);
    	   if (cmd.hasOption("h")) {
    		   help();
    	   } else if (cmd.hasOption("s")) {
    			   security = true;   
    	   } else {
    		   security = false;
    	   }
    	  } catch (ParseException e) {
    	   help();
    	  }
    	 }
    private static void help() {
    	
    	  HelpFormatter formater = new HelpFormatter();
    	  formater.printHelp("Main", options);
    	  System.exit(0);
    	 }

}



