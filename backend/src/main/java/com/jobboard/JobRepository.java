package com.jobboard;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    @Query("""
        select j from Job j
        where (:type = '' or j.type = :type)
          and (lower(j.title) like lower(concat('%', :q, '%'))
            or lower(j.company) like lower(concat('%', :q, '%'))
            or lower(j.location) like lower(concat('%', :q, '%')))
        order by j.id desc
        """)
    List<Job> search(@Param("q") String q, @Param("type") String type);
}
