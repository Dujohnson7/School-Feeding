package com.schoolfeeding.sf_backend.config;

import com.schoolfeeding.sf_backend.domain.entity.Audit;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.service.admin.audit.IAuditService;
import com.schoolfeeding.sf_backend.repository.admin.IUsersRepository;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EActionStatus;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final IAuditService auditService;
    private final IUsersRepository usersRepository;

    @Around("@annotation(auditable)")
    public Object auditMethod(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        Object result = null;
        EActionStatus status = EActionStatus.SUCCESS;
        String details = "Operation successful";

        try {
            result = joinPoint.proceed();
        } catch (Exception ex) {
            status = EActionStatus.FAILURE;
            details = "Operation failed: " + ex.getMessage();
            throw ex;
        } finally {
            Audit audit = new Audit();
            audit.setTimestamp(LocalDateTime.now());
            audit.setAction(auditable.action());
            audit.setResource(auditable.resource());
            audit.setActionStatus(status);
            audit.setDetails(details);


            Users currentUser = null;
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                Object principal = auth.getPrincipal();
                if (principal instanceof com.schoolfeeding.sf_backend.service.admin.user.UserDetailsImpl customUser) {
                    currentUser = usersRepository.findById(customUser.getUserId()).orElse(null);
                }
            }
            audit.setUser(currentUser);


            auditService.saveAudit(audit);
        }

        return result;
    }
}
