-- ============================================================
-- PROBABILITY AND STATISTICS (PS) - Complete Data Insert
-- R22, 2nd Year, Sem 1 - Common to IT, CSE, DS
-- ============================================================

-- Step 1: Insert subjects (skip if exists)
INSERT INTO subjects (regulation, branch, year, sem, name, credits)
VALUES 
  (22, 'IT', 2, 1, 'Probability and Statistics', 4),
  (22, 'CSE', 2, 1, 'Probability and Statistics', 4),
  (22, 'DS', 2, 1, 'Probability and Statistics', 4)
ON CONFLICT (regulation, branch, year, sem, name) DO NOTHING;

-- Step 2: Insert materials using automatic ID lookup
DO $$
DECLARE
  subject_id_it UUID;
  subject_id_cse UUID;
  subject_id_ds UUID;
  notes_type_id UUID;
  qb_type_id UUID;
  imp_type_id UUID;
  ref_type_id UUID;
  youtube_type_id UUID;
BEGIN
  -- Get subject IDs
  SELECT id INTO subject_id_it FROM subjects 
  WHERE regulation = 22 AND branch = 'IT' AND year = 2 AND sem = 1 AND name = 'Probability and Statistics';
  
  SELECT id INTO subject_id_cse FROM subjects 
  WHERE regulation = 22 AND branch = 'CSE' AND year = 2 AND sem = 1 AND name = 'Probability and Statistics';
  
  SELECT id INTO subject_id_ds FROM subjects 
  WHERE regulation = 22 AND branch = 'DS' AND year = 2 AND sem = 1 AND name = 'Probability and Statistics';
  
  -- Get material type IDs
  SELECT id INTO notes_type_id FROM material_types WHERE name = 'Notes';
  SELECT id INTO qb_type_id FROM material_types WHERE name = 'Question Bank';
  SELECT id INTO imp_type_id FROM material_types WHERE name = 'Important Questions';
  SELECT id INTO youtube_type_id FROM material_types WHERE name = 'YouTube Videos';
  
  -- Create Reference Books type if doesn't exist
  INSERT INTO material_types (name, has_units, icon)
  VALUES ('Reference Books', FALSE, 'BookOpen')
  ON CONFLICT (name) DO NOTHING;
  
  SELECT id INTO ref_type_id FROM material_types WHERE name = 'Reference Books';
  
  -- Insert Important Questions (all branches)
  INSERT INTO materials (subject_id, material_type_id, name, url) VALUES
    (subject_id_it, imp_type_id, 'Important Questions', 'https://drive.google.com/file/d/1lou-JDbRNzmBswTihRK__ByZpbyj-Gq-/view?usp=drive_link'),
    (subject_id_cse, imp_type_id, 'Important Questions', 'https://drive.google.com/file/d/1lou-JDbRNzmBswTihRK__ByZpbyj-Gq-/view?usp=drive_link'),
    (subject_id_ds, imp_type_id, 'Important Questions', 'https://drive.google.com/file/d/1lou-JDbRNzmBswTihRK__ByZpbyj-Gq-/view?usp=drive_link');
  
  -- Insert Question Bank (all branches)
  INSERT INTO materials (subject_id, material_type_id, name, url) VALUES
    (subject_id_it, qb_type_id, 'Question Bank', 'https://drive.google.com/file/d/1PjJbV2jt3CvIgmCadRZh8sjOan_UhpVy/view?usp=drive_link'),
    (subject_id_cse, qb_type_id, 'Question Bank', 'https://drive.google.com/file/d/1PjJbV2jt3CvIgmCadRZh8sjOan_UhpVy/view?usp=drive_link'),
    (subject_id_ds, qb_type_id, 'Question Bank', 'https://drive.google.com/file/d/1PjJbV2jt3CvIgmCadRZh8sjOan_UhpVy/view?usp=drive_link');
  
  -- Insert Statistical Tables (all branches)
  INSERT INTO materials (subject_id, material_type_id, name, url) VALUES
    (subject_id_it, ref_type_id, 'Statistical Tables', 'https://drive.google.com/file/d/18XjwBk_T38itSe_fwykH53uP-dYS_8IA/view?usp=drive_link'),
    (subject_id_cse, ref_type_id, 'Statistical Tables', 'https://drive.google.com/file/d/18XjwBk_T38itSe_fwykH53uP-dYS_8IA/view?usp=drive_link'),
    (subject_id_ds, ref_type_id, 'Statistical Tables', 'https://drive.google.com/file/d/18XjwBk_T38itSe_fwykH53uP-dYS_8IA/view?usp=drive_link');
  
  -- Insert Unit Notes for IT
  INSERT INTO materials (subject_id, material_type_id, name, url, unit) VALUES
    -- Unit 1
    (subject_id_it, notes_type_id, 'Unit 1 Notes', 'https://drive.google.com/file/d/12mKSFC5opEUJYMqPt7BgCYmDaBMMZBJ2/view?usp=drive_link', 1),
    (subject_id_it, notes_type_id, 'Unit 1 Notes (v2)', 'https://drive.google.com/file/d/1GBoXmHonqUjbe_sHK4G55_axz5--k3Mq/view?usp=drive_link', 1),
    -- Unit 2
    (subject_id_it, notes_type_id, 'Unit 2 Notes', 'https://drive.google.com/file/d/1qI1nEkzck1P55s4Q6r9dNeDhfhL0lRR5/view?usp=drive_link', 2),
    (subject_id_it, notes_type_id, 'Unit 2 Notes (v2)', 'https://drive.google.com/file/d/15lEoNqY8A146MP7sp_Yb0X8_aiBApFb5/view?usp=drive_link', 2),
    -- Unit 3
    (subject_id_it, notes_type_id, 'Unit 3 Notes', 'https://drive.google.com/file/d/1p-s4g_blA_Kf275ZkNxHkimoNdROzcsl/view?usp=drive_link', 3),
    (subject_id_it, notes_type_id, 'Unit 3 Notes (v2) Part 1', 'https://drive.google.com/file/d/1xxSFdqRsDpTT8VEt9C6tTqQ3EvO5N3Ov/view?usp=drive_link', 3),
    (subject_id_it, notes_type_id, 'Unit 3 Notes (v2) Part 2', 'https://drive.google.com/file/d/1Sv3vJY0VYK_On4joBNxi_bqotLt23QDA/view?usp=drive_link', 3),
    (subject_id_it, notes_type_id, 'Unit 3 Notes (v2) Part 3', 'https://drive.google.com/file/d/1wKeCMZi8ArP5uixZrmEqgICaBtHBgBmB/view?usp=drive_link', 3),
    -- Unit 4
    (subject_id_it, notes_type_id, 'Unit 4 Notes', 'https://drive.google.com/file/d/177noQoZRLsjQ0Tf5w3y7mnvC1gwX9acX/view?usp=drive_link', 4),
    (subject_id_it, notes_type_id, 'Unit 4 Notes (v2)', 'https://drive.google.com/file/d/1X6ZFXqscnafD5GIoF_m56alWXBNj8obP/view?usp=drive_link', 4),
    -- Unit 5
    (subject_id_it, notes_type_id, 'Unit 5 Notes', 'https://drive.google.com/file/d/1HXcjwUCpl-P647XHKlfG2aESqX3xukgL/view?usp=drive_link', 5),
    (subject_id_it, notes_type_id, 'Unit 5 Notes (v2)', 'https://drive.google.com/file/d/1HYjdVXP7OE_D_VKYqgvsiQzScB_y4QMo/view?usp=drive_link', 5);
  
  -- Insert Unit Notes for CSE
  INSERT INTO materials (subject_id, material_type_id, name, url, unit) VALUES
    -- Unit 1
    (subject_id_cse, notes_type_id, 'Unit 1 Notes', 'https://drive.google.com/file/d/12mKSFC5opEUJYMqPt7BgCYmDaBMMZBJ2/view?usp=drive_link', 1),
    (subject_id_cse, notes_type_id, 'Unit 1 Notes (v2)', 'https://drive.google.com/file/d/1GBoXmHonqUjbe_sHK4G55_axz5--k3Mq/view?usp=drive_link', 1),
    -- Unit 2
    (subject_id_cse, notes_type_id, 'Unit 2 Notes', 'https://drive.google.com/file/d/1qI1nEkzck1P55s4Q6r9dNeDhfhL0lRR5/view?usp=drive_link', 2),
    (subject_id_cse, notes_type_id, 'Unit 2 Notes (v2)', 'https://drive.google.com/file/d/15lEoNqY8A146MP7sp_Yb0X8_aiBApFb5/view?usp=drive_link', 2),
    -- Unit 3
    (subject_id_cse, notes_type_id, 'Unit 3 Notes', 'https://drive.google.com/file/d/1p-s4g_blA_Kf275ZkNxHkimoNdROzcsl/view?usp=drive_link', 3),
    (subject_id_cse, notes_type_id, 'Unit 3 Notes (v2) Part 1', 'https://drive.google.com/file/d/1xxSFdqRsDpTT8VEt9C6tTqQ3EvO5N3Ov/view?usp=drive_link', 3),
    (subject_id_cse, notes_type_id, 'Unit 3 Notes (v2) Part 2', 'https://drive.google.com/file/d/1Sv3vJY0VYK_On4joBNxi_bqotLt23QDA/view?usp=drive_link', 3),
    (subject_id_cse, notes_type_id, 'Unit 3 Notes (v2) Part 3', 'https://drive.google.com/file/d/1wKeCMZi8ArP5uixZrmEqgICaBtHBgBmB/view?usp=drive_link', 3),
    -- Unit 4
    (subject_id_cse, notes_type_id, 'Unit 4 Notes', 'https://drive.google.com/file/d/177noQoZRLsjQ0Tf5w3y7mnvC1gwX9acX/view?usp=drive_link', 4),
    (subject_id_cse, notes_type_id, 'Unit 4 Notes (v2)', 'https://drive.google.com/file/d/1X6ZFXqscnafD5GIoF_m56alWXBNj8obP/view?usp=drive_link', 4),
    -- Unit 5
    (subject_id_cse, notes_type_id, 'Unit 5 Notes', 'https://drive.google.com/file/d/1HXcjwUCpl-P647XHKlfG2aESqX3xukgL/view?usp=drive_link', 5),
    (subject_id_cse, notes_type_id, 'Unit 5 Notes (v2)', 'https://drive.google.com/file/d/1HYjdVXP7OE_D_VKYqgvsiQzScB_y4QMo/view?usp=drive_link', 5);
  
  -- Insert Unit Notes for DS
  INSERT INTO materials (subject_id, material_type_id, name, url, unit) VALUES
    -- Unit 1
    (subject_id_ds, notes_type_id, 'Unit 1 Notes', 'https://drive.google.com/file/d/12mKSFC5opEUJYMqPt7BgCYmDaBMMZBJ2/view?usp=drive_link', 1),
    (subject_id_ds, notes_type_id, 'Unit 1 Notes (v2)', 'https://drive.google.com/file/d/1GBoXmHonqUjbe_sHK4G55_axz5--k3Mq/view?usp=drive_link', 1),
    -- Unit 2
    (subject_id_ds, notes_type_id, 'Unit 2 Notes', 'https://drive.google.com/file/d/1qI1nEkzck1P55s4Q6r9dNeDhfhL0lRR5/view?usp=drive_link', 2),
    (subject_id_ds, notes_type_id, 'Unit 2 Notes (v2)', 'https://drive.google.com/file/d/15lEoNqY8A146MP7sp_Yb0X8_aiBApFb5/view?usp=drive_link', 2),
    -- Unit 3
    (subject_id_ds, notes_type_id, 'Unit 3 Notes', 'https://drive.google.com/file/d/1p-s4g_blA_Kf275ZkNxHkimoNdROzcsl/view?usp=drive_link', 3),
    (subject_id_ds, notes_type_id, 'Unit 3 Notes (v2) Part 1', 'https://drive.google.com/file/d/1xxSFdqRsDpTT8VEt9C6tTqQ3EvO5N3Ov/view?usp=drive_link', 3),
    (subject_id_ds, notes_type_id, 'Unit 3 Notes (v2) Part 2', 'https://drive.google.com/file/d/1Sv3vJY0VYK_On4joBNxi_bqotLt23QDA/view?usp=drive_link', 3),
    (subject_id_ds, notes_type_id, 'Unit 3 Notes (v2) Part 3', 'https://drive.google.com/file/d/1wKeCMZi8ArP5uixZrmEqgICaBtHBgBmB/view?usp=drive_link', 3),
    -- Unit 4
    (subject_id_ds, notes_type_id, 'Unit 4 Notes', 'https://drive.google.com/file/d/177noQoZRLsjQ0Tf5w3y7mnvC1gwX9acX/view?usp=drive_link', 4),
    (subject_id_ds, notes_type_id, 'Unit 4 Notes (v2)', 'https://drive.google.com/file/d/1X6ZFXqscnafD5GIoF_m56alWXBNj8obP/view?usp=drive_link', 4),
    -- Unit 5
    (subject_id_ds, notes_type_id, 'Unit 5 Notes', 'https://drive.google.com/file/d/1HXcjwUCpl-P647XHKlfG2aESqX3xukgL/view?usp=drive_link', 5),
    (subject_id_ds, notes_type_id, 'Unit 5 Notes (v2)', 'https://drive.google.com/file/d/1HYjdVXP7OE_D_VKYqgvsiQzScB_y4QMo/view?usp=drive_link', 5);
  
  -- Insert YouTube Playlist (all branches, NO unit - opens directly)
  INSERT INTO materials (subject_id, material_type_id, name, url) VALUES
    (subject_id_it, youtube_type_id, 'Complete Video Playlist', 'https://youtube.com/playlist?list=PLcejZ7Xxx9YNJH5X_1y-X2_vdihH4MjWF&si=yeA59_SLtKDOISLg'),
    (subject_id_cse, youtube_type_id, 'Complete Video Playlist', 'https://youtube.com/playlist?list=PLcejZ7Xxx9YNJH5X_1y-X2_vdihH4MjWF&si=yeA59_SLtKDOISLg'),
    (subject_id_ds, youtube_type_id, 'Complete Video Playlist', 'https://youtube.com/playlist?list=PLcejZ7Xxx9YNJH5X_1y-X2_vdihH4MjWF&si=yeA59_SLtKDOISLg');

  RAISE NOTICE 'Probability and Statistics data inserted successfully!';
END $$;
