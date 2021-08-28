package com.power222.tuimspfcauppbj.job;

import com.power222.tuimspfcauppbj.dao.InterviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;

import javax.transaction.Transactional;
import java.time.ZonedDateTime;

@Slf4j
public class InterviewCullingJob implements Job {

    private final InterviewRepository interviewRepo;

    public InterviewCullingJob(InterviewRepository interviewRepo) {
        this.interviewRepo = interviewRepo;
    }

    @Transactional
    @Override
    public void execute(JobExecutionContext context) {
        log.info("Culling passed interviews...");
        var passedInterviews = interviewRepo.findAllByDateTimeBefore(ZonedDateTime.now());
        log.info("Found " + passedInterviews.size() + " interviews to remove");
        interviewRepo.deleteAll(passedInterviews);
        interviewRepo.flush();
        log.info("Done!");
    }
}
