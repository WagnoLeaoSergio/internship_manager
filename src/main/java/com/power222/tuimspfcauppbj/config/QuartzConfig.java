package com.power222.tuimspfcauppbj.config;

import com.power222.tuimspfcauppbj.job.InterviewCullingJob;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.quartz.SimpleScheduleBuilder.simpleSchedule;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail interviewCullingJobDetail() {
        return JobBuilder.newJob()
                .storeDurably()
                .ofType(InterviewCullingJob.class)
                .withIdentity("InterviewCullingJob")
                .withDescription("Removes past interviews from the database")
                .build();
    }

    @Bean
    public Trigger interviewCullingTrigger(JobDetail job) {
        return TriggerBuilder.newTrigger()
                .forJob(job)
                .withIdentity("Hourly Culling Trigger")
                .withDescription("Removes passed interviews every hour")
                .withSchedule(simpleSchedule().repeatForever().withIntervalInHours(1))
                .build();
    }

}
